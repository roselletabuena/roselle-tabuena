import React, { useState } from 'react'
import { Send } from 'lucide-react'
import { useChatContext } from '@/context/ChatContext'
import { cn } from '@/lib/utils'

export function ChatInput() {
  const { sendMessage, isLoading } = useChatContext()
  const [input, setInput] = useState('')

  const handleSend = async () => {
    const value = input.trim()
    if (!value || isLoading) return
    setInput('')
    await sendMessage(value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const isTextInputEmpty = !input.trim()

  return (
    <div className="border-t border-zinc-100/60 bg-white px-6 pb-6 pt-4 dark:border-zinc-900/60 dark:bg-zinc-950">
      <div className="relative flex items-center w-full rounded-full border border-zinc-200/80 bg-zinc-50/50 p-1 transition-all focus-within:border-zinc-300 focus-within:bg-white dark:border-zinc-800 dark:bg-zinc-900/50 dark:focus-within:border-zinc-700 dark:focus-within:bg-zinc-950">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder="Ask anything..."
          className="w-full bg-transparent px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none disabled:opacity-50 dark:text-zinc-100 dark:placeholder-zinc-500"
        />
        <button
          onClick={handleSend}
          disabled={isTextInputEmpty || isLoading}
          aria-label="Send message"
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-200 disabled:opacity-40 cursor-pointer mr-0.5",
            isTextInputEmpty
              ? "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
              : "bg-zinc-900 text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-zinc-100"
          )}
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </div>
      <p className="mt-2.5 text-center text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
        GrizzlyBot might bark up the wrong tree. Ask his owner to confirm!
      </p>
    </div>
  )
}

