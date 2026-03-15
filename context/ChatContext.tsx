'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react'
import { sendChatMessage, type ChatMessage } from '@/lib/api/chat'

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatContextValue {
  isOpen: boolean
  messages: Message[]
  isLoading: boolean
  error: string | null
  scrollRef: React.RefObject<HTMLDivElement | null>
  openChat: () => void
  closeChat: () => void
  sendMessage: (content: string) => Promise<void>
  clearError: () => void
}

/* ------------------------------------------------------------------ */
/*  Context                                                             */
/* ------------------------------------------------------------------ */

const ChatContext = createContext<ChatContextValue | null>(null)

/* ------------------------------------------------------------------ */
/*  Provider                                                            */
/* ------------------------------------------------------------------ */

const INITIAL_MESSAGE: Message = {
  id: 'init',
  role: 'assistant',
  content: "Hi! I'm Roselle's AI assistant. How can I help you today?",
  timestamp: new Date(),
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    // Use a short RAF so the DOM has time to paint the new message first
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      }
    })
  }, [])

  const openChat = useCallback(() => setIsOpen(true), [])
  const closeChat = useCallback(() => setIsOpen(false), [])
  const clearError = useCallback(() => setError(null), [])

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return

      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: content.trim(),
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)
      setError(null)
      scrollToBottom()

      // Build the history the API expects (exclude the initial greeting)
      const history: ChatMessage[] = messages
        .filter((m) => m.id !== 'init')
        .map(({ role, content }) => ({ role, content }))

      history.push({ role: 'user', content: content.trim() })

      try {
        const reply = await sendChatMessage(history)

        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: reply,
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, assistantMessage])
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Something went wrong.'
        setError(message)
      } finally {
        setIsLoading(false)
        scrollToBottom()
      }
    },
    [isLoading, messages, scrollToBottom],
  )

  return (
    <ChatContext.Provider
      value={{
        isOpen,
        messages,
        isLoading,
        error,
        scrollRef,
        openChat,
        closeChat,
        sendMessage,
        clearError,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

/* ------------------------------------------------------------------ */
/*  Hook                                                                */
/* ------------------------------------------------------------------ */

export function useChatContext(): ChatContextValue {
  const ctx = useContext(ChatContext)
  if (!ctx) {
    throw new Error('useChatContext must be used inside <ChatProvider>')
  }
  return ctx
}
