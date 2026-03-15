import React from 'react'
import { Bot, Minus } from 'lucide-react'
import { useChatContext } from '@/context/ChatContext'

export function ChatHeader() {
  const { closeChat } = useChatContext()

  return (
    <div className="flex items-center justify-between border-b border-zinc-100 p-4 dark:border-zinc-900">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
          <Bot className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            AI Assistant
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Powered by AWS Bedrock
          </p>
        </div>
      </div>

      <button
        onClick={closeChat}
        aria-label="Minimize chat"
        className="rounded-full p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:text-zinc-500 dark:hover:bg-zinc-900 dark:hover:text-zinc-300"
      >
        <Minus className="h-5 w-5" />
      </button>
    </div>
  )
}
