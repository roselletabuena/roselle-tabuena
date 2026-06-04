import { motion } from 'framer-motion'
import { useChatContext } from '@/context/ChatContext'
import type { Message } from '@/context/ChatContext'

export function ChatFooter({ message }: { message: Message }) {
  const { sendMessage } = useChatContext()

  if (!message.suggestedPrompts) return null

  return (
    <div className="mt-4 border-t border-zinc-200/70 pt-4 dark:border-zinc-700/70">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {message.suggestedPrompts.intro}
      </p>

      <ul className="mt-4 list-disc space-y-1 pl-5">
        {message.suggestedPrompts.questions.map((prompt) => (
          <li key={prompt}>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => sendMessage(prompt)}
              className="group cursor-pointer text-left"
            >
              <span className="flex items-start gap-2">
                <span className="underline decoration-zinc-300 underline-offset-2 transition group-hover:text-blue-500 group-hover:decoration-blue-500">
                  {prompt}
                </span>
              </span>
            </motion.button>
          </li>
        ))}
      </ul>
    </div>
  )
}
