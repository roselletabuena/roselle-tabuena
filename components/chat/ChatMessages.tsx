import { motion } from 'framer-motion'
import { ChatBubble } from './ChatBubble'
import { SuggestedPrompts } from './SuggestedPrompts'
import { useChatContext } from '@/context/ChatContext'

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
  const { messages, error, scrollRef, clearError } = useChatContext()

  return (
    <>
      <div ref={scrollRef} className="flex-1 space-y-6 overflow-y-auto  p-6 dark:bg-[#121212]">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        <SuggestedPrompts />
      </div>

      {error && <ErrorBanner message={error} onDismiss={clearError} />}
    </>
  )
}
