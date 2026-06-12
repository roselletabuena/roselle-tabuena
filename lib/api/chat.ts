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

export interface ChatResponse {
  answer: string
  uiWidget?: {
    type: 'calendar'
    url: string
  }
}

export async function sendChatMessage(messages: ChatMessage[]): Promise<ChatResponse> {
  const response = await fetch('/api/chat', {
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

  if (data?.answer) {
    return {
      answer: data.answer,
      uiWidget: data.uiWidget,
    }
  }

  throw new Error('Unexpected response format from chat API')
}
