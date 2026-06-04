'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  sendChatMessage,
  type ChatMessage,
  getSuggestedPrompts,
} from '@/lib/api/chat'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface SuggestedPrompts {
  intro: string
  questions: Array<string>
}

export interface UIWidget {
  type: 'calendar'
  url: string
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  suggestedPrompts?: SuggestedPrompts
  uiWidget?: UIWidget
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
  resetChat: () => void
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
  content:
    'Woof! I’m Grizz, Roselle’s AI assistant dog 🐾 Want to sniff out her projects, tech stack, or recent achievements? You can also ask me to set up a schedule! Bark at me anytime!',
  timestamp: new Date(),
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const isInitialized = useRef(false)

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      }
    })
  }, [])

  // Load from localStorage on mount (Client-side only)
  useEffect(() => {
    const saved = localStorage.getItem('portfolio_chat_messages')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        const loadedMessages = parsed.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        }))
        setMessages(loadedMessages)
      } catch (e) {
        console.error('Failed to parse chat messages', e)
      }
    }
    isInitialized.current = true
  }, [])

  // Save to localStorage when messages change
  useEffect(() => {
    if (isInitialized.current) {
      localStorage.setItem('portfolio_chat_messages', JSON.stringify(messages))
    }
  }, [messages])

  const openChat = useCallback(() => setIsOpen(true), [])
  const closeChat = useCallback(() => setIsOpen(false), [])
  const clearError = useCallback(() => setError(null), [])

  const resetChat = useCallback(() => {
    setMessages([INITIAL_MESSAGE])
    localStorage.removeItem('portfolio_chat_messages')
    setError(null)
  }, [])

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

      const history: ChatMessage[] = messages
        .filter((m) => m.id !== 'init')
        .map(({ role, content }) => ({ role, content }))

      history.push({ role: 'user', content: content.trim() })

      try {
        const [chatResponse, suggestedPrompts] = await Promise.all([
          sendChatMessage(history),
          getSuggestedPrompts(content, history),
        ])

        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: chatResponse.answer,
          uiWidget: chatResponse.uiWidget,
          suggestedPrompts,
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
        resetChat,
        clearError,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChatContext(): ChatContextValue {
  const ctx = useContext(ChatContext)
  if (!ctx) {
    throw new Error('useChatContext must be used inside <ChatProvider>')
  }
  return ctx
}
