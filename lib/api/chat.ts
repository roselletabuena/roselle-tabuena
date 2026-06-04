const CHAT_API_URL = process.env.NEXT_PUBLIC_CHAT_API_URL
import { SuggestedPrompts } from '@/context/ChatContext'

if (!CHAT_API_URL) {
  console.warn(
    'Warning: NEXT_PUBLIC_CHAT_API_URL is not defined in environment variables.',
  )
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function getSuggestedPrompts(
  lastUserMessage: string,
  conversation: ChatMessage[],
): Promise<SuggestedPrompts> {
  if (!CHAT_API_URL) {
    throw new Error('CHAT_API_URL is not configured')
  }

  const response = await fetch(CHAT_API_URL + 'portfolio/suggested-prompts', {
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

export async function sendChatMessage(messages: ChatMessage[]) {
  if (!CHAT_API_URL) {
    throw new Error('CHAT_API_URL is not configured')
  }

  const response = await fetch(CHAT_API_URL + 'portfolio/chat', {
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
