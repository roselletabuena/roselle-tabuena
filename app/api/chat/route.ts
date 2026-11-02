import { NextResponse } from 'next/server'
import {
  chatPayloadSchema,
  extractClientIp,
  INVALID_PAYLOAD_ERROR,
} from '@/lib/schemas/chat'

export async function POST(request: Request) {
  try {
    const chatApiUrl =
      process.env.NEXT_PUBLIC_CHAT_API_URL || process.env.CHAT_API_URL
    const apiKey = process.env.INTERNAL_API_KEY

    if (!chatApiUrl) {
      return NextResponse.json(
        { error: 'Chat API URL is not configured' },
        { status: 500 },
      )
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Internal API Key is not configured' },
        { status: 500 },
      )
    }

    let rawBody: unknown
    try {
      rawBody = await request.json()
    } catch {
      return NextResponse.json(
        { error: INVALID_PAYLOAD_ERROR },
        { status: 400 },
      )
    }

    const validation = chatPayloadSchema.safeParse(rawBody)
    if (!validation.success) {
      return NextResponse.json(
        { error: INVALID_PAYLOAD_ERROR },
        { status: 400 },
      )
    }

    const body = validation.data
    const visitorId = request.headers.get('x-visitor-id')
    const clientIp = extractClientIp(request)
    const baseUrl = chatApiUrl.endsWith('/') ? chatApiUrl : `${chatApiUrl}/`

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-internal-api-key': apiKey,
    }

    if (visitorId) {
      headers['x-visitor-id'] = visitorId
    }

    if (clientIp) {
      headers['x-client-ip'] = clientIp
    }

    const response = await fetch(`${baseUrl}portfolio/chat`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Backend API error: ${response.statusText}` },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error in chat proxy route:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 },
    )
  }
}
