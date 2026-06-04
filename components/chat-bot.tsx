'use client'

import { MessageCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChatProvider, useChatContext } from '@/context/ChatContext'
import { ChatHeader } from '@/components/chat/ChatHeader'
import { ChatMessages } from '@/components/chat/ChatMessages'
import { ChatInput } from '@/components/chat/ChatInput'

function ChatWidget() {
  const { isOpen, openChat } = useChatContext()

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
          <motion.button
            key="chat-trigger"
            onClick={openChat}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            aria-label="Open AI chat assistant"
            className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-zinc-50 shadow-xl transition-all hover:scale-110 active:scale-95 dark:bg-zinc-100 dark:text-zinc-900"
          >
            <div className="absolute inset-0 rounded-full bg-zinc-800/20 blur-md transition-opacity group-hover:opacity-100 dark:bg-zinc-100/20" />
            <MessageCircle className="relative h-6 w-6" />
          </motion.button>
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
