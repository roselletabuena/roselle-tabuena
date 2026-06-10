'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChatProvider, useChatContext } from '@/context/ChatContext'
import { ChatHeader } from '@/components/chat/ChatHeader'
import { ChatMessages } from '@/components/chat/ChatMessages'
import { ChatInput } from '@/components/chat/ChatInput'

function ChatWidget() {
  const { isOpen, openChat, messages } = useChatContext()
  const [showTeaser, setShowTeaser] = useState(false)

  useEffect(() => {
    // Only show teaser if:
    // 1. Chat is closed.
    // 2. User has not dismissed it in localStorage.
    // 3. User hasn't interacted/sent messages yet (i.e. only initial message in chat).
    const isDismissed = localStorage.getItem('grizz_chat_teaser_dismissed') === 'true'
    const hasInteracted = messages.length > 1

    if (!isOpen && !isDismissed && !hasInteracted) {
      const timer = setTimeout(() => {
        setShowTeaser(true)
      }, 1500)
      return () => clearTimeout(timer)
    } else {
      setShowTeaser(false)
    }
  }, [isOpen, messages])

  const handleDismissTeaser = (e: React.MouseEvent) => {
    e.stopPropagation() // prevent opening the chat
    localStorage.setItem('grizz_chat_teaser_dismissed', 'true')
    setShowTeaser(false)
  }

  const handleTeaserClick = () => {
    localStorage.setItem('grizz_chat_teaser_dismissed', 'true')
    setShowTeaser(false)
    openChat()
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end sm:right-10 sm:bottom-6">
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex h-[80vh] w-[95vw] max-w-[520px] flex-col overflow-hidden rounded-[24px] border border-zinc-100 bg-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] sm:h-[580px] sm:w-[460px] sm:max-w-none dark:border-zinc-900 dark:bg-zinc-950"
          >
            <ChatHeader />
            <ChatMessages />
            <ChatInput />
          </motion.div>
        ) : (
          <motion.div
            key="chat-trigger-container"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="relative flex items-center justify-end"
          >
            <AnimatePresence>
              {showTeaser && (
                <motion.div
                  key="chat-teaser"
                  initial={{ opacity: 0, scale: 0.85, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.85, y: 10 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  onClick={handleTeaserClick}
                  className="absolute bottom-16 right-0 sm:bottom-0 sm:right-16 mr-0 sm:mr-3 flex items-center gap-2.5 rounded-[16px] border border-zinc-100 bg-white/95 p-2.5 shadow-sm backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/95 cursor-pointer w-[240px] sm:w-[260px] select-none group transition-all hover:scale-[1.01]"
                >
                  <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                    <img src="/grizz-bot.png" alt="Grizz" className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 pr-1.5">
                    <h4 className="text-[13.5px] font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 leading-none">
                      Grizz <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    </h4>
                    <p className="text-[13px] leading-snug text-zinc-500 dark:text-zinc-400 mt-0.5">
                      Woof! I'm Roselle's AI assistant virtual pet 🐾 Ask me about her projects, tech stack, or book a chat!
                    </p>
                  </div>
                  <button
                    onClick={handleDismissTeaser}
                    aria-label="Dismiss message"
                    className="absolute top-2 right-2 rounded-full p-0.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:text-zinc-500 dark:hover:text-zinc-300 dark:hover:bg-zinc-900 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={openChat}
              aria-label="Open AI chat assistant"
              className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-zinc-50 shadow-md transition-all hover:scale-110 active:scale-95 dark:bg-zinc-100 dark:text-zinc-900"
            >
              <MessageCircle className="relative h-6 w-6" />
              {showTeaser && (
                <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-orange-500"></span>
                </span>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function ChatBot() {
  return (
    <ChatProvider>
      <ChatWidget />
    </ChatProvider>
  )
}
