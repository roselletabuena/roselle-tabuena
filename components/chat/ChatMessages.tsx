import { motion } from 'framer-motion'
import { ChatBubble } from './ChatBubble'
import { SuggestedPrompts } from './SuggestedPrompts'
import { useChatContext } from '@/context/ChatContext'

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex w-full gap-3"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full overflow-hidden border border-zinc-100 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <img src="/grizz-bot.png" alt="Grizz" className="h-full w-full object-cover" />
      </div>
      <div className="flex items-center gap-1 rounded-[20px] border border-zinc-100/80 bg-zinc-50 px-5 py-3.5 dark:border-zinc-800/80 dark:bg-zinc-900">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 dark:bg-zinc-500" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:0.2s] dark:bg-zinc-500" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:0.4s] dark:bg-zinc-500" />
      </div>
    </motion.div>
  )
}

function ErrorBanner({
  message,
  onDismiss,
}: {
  message: string
  onDismiss: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-4 mb-4 flex items-center justify-between rounded-xl bg-red-50 px-3 py-2.5 text-xs text-red-600 dark:bg-red-950/40 dark:text-red-400"
    >
      <span>{message}</span>
      <button
        onClick={onDismiss}
        className="ml-2 text-red-400 hover:text-red-600 dark:hover:text-red-300 cursor-pointer"
        aria-label="Dismiss error"
      >
        ✕
      </button>
    </motion.div>
  )
}

export function ChatMessages() {
  const { messages, isLoading, error, scrollRef, clearError } = useChatContext()

  return (
    <>
      <div ref={scrollRef} className="flex-1 space-y-6 overflow-y-auto  p-6 dark:bg-[#121212]">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        {isLoading && <TypingIndicator />}
        <SuggestedPrompts />
      </div>

      {error && <ErrorBanner message={error} onDismiss={clearError} />}
    </>
  )
}
