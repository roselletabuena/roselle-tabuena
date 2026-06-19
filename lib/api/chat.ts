import { SuggestedPrompts } from '@/context/ChatContext'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function getSuggestedPrompts(
  lastUserMessage: string,
  conversation: ChatMessage[],
): Promise<SuggestedPrompts> {
  const response = await fetch('/api/chat/suggested-prompts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ conversation, lastUserMessage }),
  })

  if (!response.ok) {
    throw new Error(`Chat API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()

  return data || undefined
}

export interface UIWidget {
  type: 'calendar'
  url: string
}

export interface ChatResponse {
  answer: string
  uiWidget?: UIWidget
}

export async function sendChatMessage(messages: ChatMessage[]): Promise<ChatResponse> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (typeof window !== 'undefined') {
    const visitorId = localStorage.getItem('portfolio_visitor_id')
    if (visitorId) {
      headers['x-visitor-id'] = visitorId
    }
  }

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers,
    body: JSON.stringify({ messages }),
  })

  if (!response.ok) {
    throw new Error(`Chat API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()

  if (data?.answer) {
    return {
      answer: data.answer,
      uiWidget: data.uiWidget,
    }
  }

  throw new Error('Unexpected response format from chat API')
}

export type StreamChunk =
  | { type: 'token'; text: string }
  | { type: 'guardrail'; fallback: string }
  | { type: 'done'; uiWidget?: UIWidget; suggestedPrompts?: SuggestedPrompts }
  | { type: 'error'; message: string }

export async function streamChatMessage(
  messages: ChatMessage[],
  onChunk: (chunk: StreamChunk) => void
): Promise<void> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  // Include visitor-id header if saved in local storage
  if (typeof window !== 'undefined') {
    const visitorId = localStorage.getItem('portfolio_visitor_id')
    if (visitorId) {
      headers['x-visitor-id'] = visitorId
    }
  }

  const response = await fetch('/api/chat/stream', {
    method: 'POST',
    headers,
    body: JSON.stringify({ messages }),
  })

  if (!response.ok) {
    throw new Error(`Chat API error: ${response.status} ${response.statusText}`)
  }

  const reader = response.body?.getReader()
  if (!reader) {
    throw new Error('No body stream returned')
  }

  const decoder = new TextDecoder()
  let buffer = ''
  let done = false

  while (!done) {
    const { value, done: readerDone } = await reader.read()
    done = readerDone
    if (value) {
      console.log(`[CLIENT API] Received chunk of size ${value.length} bytes`)
      buffer += decoder.decode(value, { stream: !done })
      const lines = buffer.split('\n')
      
      // Save the last potentially incomplete line in the buffer
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed.startsWith('data: ')) {
          try {
            console.log(`[CLIENT API] Parsed SSE line: ${trimmed}`)
            const data = JSON.parse(trimmed.slice(6))
            if (data.type === 'error') {
              throw new Error(data.message || 'Stream error occurred')
            }
            onChunk(data)
          } catch (e) {
            console.error('Failed to parse SSE data frame:', e)
          }
        }
      }
    }
  }
}
