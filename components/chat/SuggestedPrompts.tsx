import React from 'react'
import { motion } from 'framer-motion'
import { useChatContext } from '@/context/ChatContext'

const SUGGESTED_PROMPTS = [
  'What technologies do you specialise in?',
  'Tell me about your work experience.',
  'What are your AWS certifications?',
]

export function SuggestedPrompts() {
  const { sendMessage, messages, isLoading } = useChatContext()

  // Only show prompts until the user has sent their first message
  const hasUserMessage = messages.some((m) => m.role === 'user')
  if (hasUserMessage) return null

  return (
    <div className="flex flex-col gap-2 px-4 pb-2">
      <p className="text-xs text-zinc-400 dark:text-zinc-500">Suggested</p>
      <div className="flex flex-col gap-1.5">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <motion.button
            key={prompt}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
            onClick={() => sendMessage(prompt)}
            className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-left text-xs text-zinc-600 transition-colors hover:border-zinc-300 hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-800/70"
          >
            {prompt}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
