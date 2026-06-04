import React from 'react'
import { Minus, RotateCcw } from 'lucide-react'
import { useChatContext } from '@/context/ChatContext'

export function ChatHeader() {
  const { closeChat, resetChat } = useChatContext()

  return (
    <div className="flex items-center justify-between border-b border-zinc-100/60 bg-white px-6 py-5 dark:border-zinc-900/60 dark:bg-zinc-950">
      <div className="flex items-center gap-3">
        <div className="relative h-10 w-10 overflow-hidden rounded-full border border-zinc-100 dark:border-zinc-800">
          <img src="/grizz-bot.png" alt="Grizz" className="h-full w-full object-cover" />
        </div>
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            GrizzlyBot
          </h3>
          <p className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
            Powered by AWS Bedrock
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={resetChat}
          aria-label="Reset chat"
          title="Reset conversation"
          className="rounded-full p-1.5 text-zinc-400 transition-colors hover:bg-zinc-50 hover:text-zinc-600 dark:text-zinc-500 dark:hover:bg-zinc-900 dark:hover:text-zinc-300 cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={closeChat}
          aria-label="Minimize chat"
          className="rounded-full p-1.5 text-zinc-400 transition-colors hover:bg-zinc-50 hover:text-zinc-600 dark:text-zinc-500 dark:hover:bg-zinc-900 dark:hover:text-zinc-300 cursor-pointer"
        >
          <Minus className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
