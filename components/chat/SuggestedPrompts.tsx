'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useChatContext } from '@/context/ChatContext'
import { Spotlight } from '@/components/ui/spotlight'

const INITIAL_SUGGESTED_PROMPTS = [
  "Can you sniff out her recent projects? 🐶",
  'Is Roselle available? (Help me schedule a chat) 📅',
  'Is she available for new opportunities? 💻',
]

export function SuggestedPrompts() {
  const { sendMessage, messages, isLoading, scrollRef } = useChatContext()

  // If the chatbot is loading, hide suggestions to avoid layout shifting
  if (isLoading) return null

  // Find the last message
  const lastMessage = messages[messages.length - 1]
  const isAssistantLast = lastMessage?.role === 'assistant'

  let questions: string[] = []
  let introText = 'Suggested topics'

  if (messages.length === 1) {
    // Initial state: show standard starter prompts
    questions = INITIAL_SUGGESTED_PROMPTS
  } else if (isAssistantLast && lastMessage?.suggestedPrompts?.questions) {
    // Middle of conversation: show dynamic suggestions returned from Bedrock
    questions = lastMessage.suggestedPrompts.questions
    introText = lastMessage.suggestedPrompts.intro || 'Follow-up questions'
  }

  // Scroll to bottom when suggested prompts are rendered
  useEffect(() => {
    if (questions.length > 0 && scrollRef?.current) {
      const scrollContainer = scrollRef.current
      const timer = setTimeout(() => {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [questions, scrollRef])

  if (questions.length === 0) return null

  return (
    <div className="flex flex-col items-end gap-2.5">
      <span className="px-1 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
        {introText}
      </span>
      <div className="flex flex-wrap justify-end gap-2">
        {questions.map((prompt) => (
          <motion.div
            key={prompt}
            whileHover={{ scale: 1.01, y: -0.5 }}
            whileTap={{ scale: 0.97 }}
            className="relative overflow-hidden rounded-full bg-zinc-200/50 p-[1px] dark:bg-zinc-800/30"
          >
            <Spotlight
              className="from-zinc-900 via-zinc-800 to-zinc-700 blur-xl dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-50"
              size={64}
            />
            <button
              disabled={isLoading}
              onClick={() => sendMessage(prompt)}
              className="relative cursor-pointer rounded-full bg-white px-4 py-2 text-left text-[13px] font-medium text-zinc-600 transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              {prompt}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
