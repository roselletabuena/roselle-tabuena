import React, { useState } from 'react'
import { Send } from 'lucide-react'
import { useChatContext } from '@/context/ChatContext'

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

  return (
    <div className="border-t border-zinc-100 p-4 dark:border-zinc-900">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder="Ask me anything..."
          className="w-full rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm focus:border-zinc-500 focus:outline-none disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-600"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          aria-label="Send message"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-zinc-50 transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
