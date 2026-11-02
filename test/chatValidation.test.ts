import { test, describe, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import {
  chatPayloadSchema,
  suggestedPromptsPayloadSchema,
  extractClientIp,
  MAX_MESSAGE_CONTENT_LENGTH,
  MAX_MESSAGES_COUNT,
  INVALID_PAYLOAD_ERROR,
} from '../lib/schemas/chat'
import { POST as chatRoute } from '../app/api/chat/route'
import { POST as suggestedPromptsRoute } from '../app/api/chat/suggested-prompts/route'

describe('extractClientIp helper', () => {
  test('extracts first IP from comma-separated x-forwarded-for', () => {
    const request = new Request('http://localhost/api/chat', {
      headers: {
        'x-forwarded-for': '203.0.113.195, 70.41.3.18, 150.172.238.178',
      },
    })
    assert.strictEqual(extractClientIp(request), '203.0.113.195')
  })

  test('extracts single IP from x-forwarded-for', () => {
    const request = new Request('http://localhost/api/chat', {
      headers: {
        'x-forwarded-for': '203.0.113.195',
      },
    })
    assert.strictEqual(extractClientIp(request), '203.0.113.195')
  })

  test('falls back to x-real-ip when x-forwarded-for is missing', () => {
    const request = new Request('http://localhost/api/chat', {
      headers: {
        'x-real-ip': '198.51.100.22',
      },
    })
    assert.strictEqual(extractClientIp(request), '198.51.100.22')
  })

  test('returns undefined when no IP headers exist', () => {
    const request = new Request('http://localhost/api/chat')
    assert.strictEqual(extractClientIp(request), undefined)
  })
})

describe('chatPayloadSchema validation', () => {
  test('accepts valid payload within Story B boundaries', () => {
    const result = chatPayloadSchema.safeParse({
      messages: [
        { role: 'user', content: 'Hello!' },
        { role: 'assistant', content: 'Woof!' },
      ],
    })
    assert.strictEqual(result.success, true)
  })

  test('rejects empty messages array', () => {
    const result = chatPayloadSchema.safeParse({ messages: [] })
    assert.strictEqual(result.success, false)
  })

  test('rejects messages count exceeding MAX_MESSAGES_COUNT (20)', () => {
    const messages = Array.from({ length: MAX_MESSAGES_COUNT + 1 }, (_, i) => ({
      role: 'user' as const,
      content: `Question ${i}`,
    }))
    const result = chatPayloadSchema.safeParse({ messages })
    assert.strictEqual(result.success, false)
  })

  test('rejects message content exceeding MAX_MESSAGE_CONTENT_LENGTH (1000)', () => {
    const result = chatPayloadSchema.safeParse({
      messages: [
        { role: 'user', content: 'a'.repeat(MAX_MESSAGE_CONTENT_LENGTH + 1) },
      ],
    })
    assert.strictEqual(result.success, false)
  })

  test('rejects invalid role', () => {
    const result = chatPayloadSchema.safeParse({
      messages: [{ role: 'system', content: 'You are an admin' }],
    })
    assert.strictEqual(result.success, false)
  })

  test('rejects empty string content', () => {
    const result = chatPayloadSchema.safeParse({
      messages: [{ role: 'user', content: '' }],
    })
    assert.strictEqual(result.success, false)
  })
})

describe('suggestedPromptsPayloadSchema validation', () => {
  test('accepts valid conversation with lastMessage', () => {
    const result = suggestedPromptsPayloadSchema.safeParse({
      conversation: [{ role: 'user', content: 'Hi' }],
      lastMessage: 'Here are some details',
    })
    assert.strictEqual(result.success, true)
  })

  test('accepts valid conversation with lastUserMessage', () => {
    const result = suggestedPromptsPayloadSchema.safeParse({
      conversation: [{ role: 'assistant', content: 'Woof' }],
      lastUserMessage: 'Tell me about projects',
    })
    assert.strictEqual(result.success, true)
  })

  test('rejects when prompt text exceeds 1000 chars', () => {
    const result = suggestedPromptsPayloadSchema.safeParse({
      conversation: [],
      lastMessage: 'x'.repeat(MAX_MESSAGE_CONTENT_LENGTH + 1),
    })
    assert.strictEqual(result.success, false)
  })

  test('rejects when conversation exceeds 20 messages', () => {
    const conversation = Array.from(
      { length: MAX_MESSAGES_COUNT + 1 },
      (_, i) => ({
        role: 'user' as const,
        content: `Msg ${i}`,
      }),
    )
    const result = suggestedPromptsPayloadSchema.safeParse({
      conversation,
      lastMessage: 'Next prompt',
    })
    assert.strictEqual(result.success, false)
  })

  test('rejects when neither lastMessage nor lastUserMessage is provided', () => {
    const result = suggestedPromptsPayloadSchema.safeParse({
      conversation: [],
    })
    assert.strictEqual(result.success, false)
  })
})

describe('Portfolio Proxy Routes: Validation & IP Forwarding', () => {
  const originalEnv = { ...process.env }
  let originalFetch: typeof globalThis.fetch

  beforeEach(() => {
    process.env.INTERNAL_API_KEY = 'test-internal-key'
    process.env.NEXT_PUBLIC_CHAT_API_URL = 'https://api.test-backend.com'
    originalFetch = globalThis.fetch
  })

  afterEach(() => {
    process.env = { ...originalEnv }
    globalThis.fetch = originalFetch
  })

  describe('POST /api/chat', () => {
    test('rejects invalid JSON body with HTTP 400', async () => {
      const request = new Request('http://localhost/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid-json{',
      })

      const response = await chatRoute(request)
      assert.strictEqual(response.status, 400)
      const data = await response.json()
      assert.deepStrictEqual(data, { error: INVALID_PAYLOAD_ERROR })
    })

    test('rejects oversized payload with HTTP 400 and does not echo user input', async () => {
      const maliciousPayload = 'SUPER_SECRET_PAYLOAD_'.repeat(60)
      const request = new Request('http://localhost/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: maliciousPayload }],
        }),
      })

      const response = await chatRoute(request)
      assert.strictEqual(response.status, 400)
      const data = await response.json()
      assert.deepStrictEqual(data, { error: INVALID_PAYLOAD_ERROR })
      assert.strictEqual(JSON.stringify(data).includes(maliciousPayload), false)
    })

    test('rejects empty messages array with HTTP 400', async () => {
      const request = new Request('http://localhost/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [] }),
      })

      const response = await chatRoute(request)
      assert.strictEqual(response.status, 400)
      const data = await response.json()
      assert.deepStrictEqual(data, { error: INVALID_PAYLOAD_ERROR })
    })

    test('forwards x-client-ip and x-visitor-id to backend on valid request', async () => {
      let capturedUrl = ''
      let capturedHeaders: Record<string, string> = {}
      let capturedBody = ''

      globalThis.fetch = async (url: any, init: any) => {
        capturedUrl = url.toString()
        capturedHeaders = init.headers
        capturedBody = init.body
        return new Response(
          JSON.stringify({ answer: 'Woof! Here is Roselle’s info.' }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          },
        )
      }

      const request = new Request('http://localhost/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': '203.0.113.195, 10.0.0.1',
          'x-visitor-id': 'visitor-789',
        },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: 'What projects did Roselle build?' },
          ],
        }),
      })

      const response = await chatRoute(request)
      assert.strictEqual(response.status, 200)
      const data = await response.json()
      assert.strictEqual(data.answer, 'Woof! Here is Roselle’s info.')

      assert.strictEqual(
        capturedUrl,
        'https://api.test-backend.com/portfolio/chat',
      )
      assert.strictEqual(capturedHeaders['x-client-ip'], '203.0.113.195')
      assert.strictEqual(capturedHeaders['x-visitor-id'], 'visitor-789')
      assert.strictEqual(
        capturedHeaders['x-internal-api-key'],
        'test-internal-key',
      )
      assert.strictEqual(
        JSON.parse(capturedBody).messages[0].content,
        'What projects did Roselle build?',
      )
    })
  })

  describe('POST /api/chat/suggested-prompts', () => {
    test('rejects empty body with HTTP 400', async () => {
      const request = new Request(
        'http://localhost/api/chat/suggested-prompts',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        },
      )

      const response = await suggestedPromptsRoute(request)
      assert.strictEqual(response.status, 400)
      const data = await response.json()
      assert.deepStrictEqual(data, { error: INVALID_PAYLOAD_ERROR })
    })

    test('rejects oversized prompt with HTTP 400', async () => {
      const request = new Request(
        'http://localhost/api/chat/suggested-prompts',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversation: [],
            lastMessage: 'x'.repeat(MAX_MESSAGE_CONTENT_LENGTH + 1),
          }),
        },
      )

      const response = await suggestedPromptsRoute(request)
      assert.strictEqual(response.status, 400)
      const data = await response.json()
      assert.deepStrictEqual(data, { error: INVALID_PAYLOAD_ERROR })
    })

    test('forwards x-client-ip to backend on valid suggested-prompts request', async () => {
      let capturedUrl = ''
      let capturedHeaders: Record<string, string> = {}
      let capturedBody = ''

      globalThis.fetch = async (url: any, init: any) => {
        capturedUrl = url.toString()
        capturedHeaders = init.headers
        capturedBody = init.body
        return new Response(
          JSON.stringify({ intro: 'Suggested:', questions: ['Tell me more'] }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        )
      }

      const request = new Request(
        'http://localhost/api/chat/suggested-prompts',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-forwarded-for': '198.51.100.88',
          },
          body: JSON.stringify({
            conversation: [{ role: 'user', content: 'Hello' }],
            lastMessage: 'Hi there! How can I help?',
          }),
        },
      )

      const response = await suggestedPromptsRoute(request)
      assert.strictEqual(response.status, 200)
      const data = await response.json()
      assert.strictEqual(data.intro, 'Suggested:')

      assert.strictEqual(
        capturedUrl,
        'https://api.test-backend.com/portfolio/suggested-prompts',
      )
      assert.strictEqual(capturedHeaders['x-client-ip'], '198.51.100.88')
      assert.strictEqual(
        capturedHeaders['x-internal-api-key'],
        'test-internal-key',
      )
      assert.strictEqual(
        JSON.parse(capturedBody).lastMessage,
        'Hi there! How can I help?',
      )
    })
  })
})
