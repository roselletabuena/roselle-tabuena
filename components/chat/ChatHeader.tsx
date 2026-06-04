import React from 'react'
import { Minus, RotateCcw } from 'lucide-react'
import { useChatContext } from '@/context/ChatContext'

export function ChatHeader() {
  const { closeChat, resetChat } = useChatContext()

  return (
    <div className="flex items-center justify-between border-b border-zinc-100 p-4 dark:border-zinc-900">
      <div className="flex items-center gap-3">
        <div className="relative h-9 w-9 overflow-hidden rounded-full border border-zinc-200 dark:border-zinc-800">
          <img src="/grizz-bot.png" alt="Grizz" className="h-full w-full object-cover" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            GrizzlyBot
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Powered by AWS Bedrock
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={resetChat}
          aria-label="Reset chat"
          title="Reset conversation"
          className="rounded-full p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:text-zinc-500 dark:hover:bg-zinc-900 dark:hover:text-zinc-300"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        <button
          onClick={closeChat}
          aria-label="Minimize chat"
          className="rounded-full p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:text-zinc-500 dark:hover:bg-zinc-900 dark:hover:text-zinc-300"
        >
          <Minus className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
