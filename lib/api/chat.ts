const CHAT_API_URL = process.env.NEXT_PUBLIC_CHAT_API_URL

if (!CHAT_API_URL) {
  console.warn(
    'Warning: NEXT_PUBLIC_CHAT_API_URL is not defined in environment variables.',
  )
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function sendChatMessage(
  messages: ChatMessage[],
): Promise<string> {
  if (!CHAT_API_URL) {
    throw new Error('CHAT_API_URL is not configured')
  }

  const response = await fetch(CHAT_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages }),
  })

  if (!response.ok) {
    throw new Error(`Chat API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()

  if (data?.answer) return data.answer

  throw new Error('Unexpected response format from chat API')
}
