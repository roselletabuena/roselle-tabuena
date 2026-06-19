import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const streamApiUrl = process.env.CHAT_STREAM_API_URL
    const apiKey = process.env.INTERNAL_API_KEY

    if (!streamApiUrl) {
      return NextResponse.json({ error: 'Chat Stream API URL is not configured' }, { status: 500 })
    }

    if (!apiKey) {
      return NextResponse.json({ error: 'Internal API Key is not configured' }, { status: 500 })
    }

    const body = await request.json()
    const visitorId = request.headers.get('x-visitor-id')

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-internal-api-key': apiKey,
    }

    if (visitorId) {
      headers['x-visitor-id'] = visitorId
    }

    const response = await fetch(streamApiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      cache: 'no-store',
    })

    if (!response.ok) {
      return new Response(`Backend stream error: ${response.statusText}`, { status: response.status })
    }

    // Use TransformStream to forward chunks immediately without buffering
    const { readable, writable } = new TransformStream()
    const writer = writable.getWriter()
    const reader = response.body?.getReader()

    if (reader) {
      (async () => {
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) {
              console.log('[API ROUTE] Stream finished')
              await writer.close()
              break
            }
            console.log(`[API ROUTE] Forwarding chunk of size ${value.length} bytes`)
            await writer.write(value)
          }
        } catch (err) {
          console.error('[API ROUTE] Error forwarding stream chunks:', err)
          await writer.abort(err)
        }
      })()
    }

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    })
  } catch (error: any) {
    console.error('Error in chat proxy stream route:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
