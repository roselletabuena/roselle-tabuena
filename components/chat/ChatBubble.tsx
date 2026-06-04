import { Bot, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { Message } from '@/context/ChatContext'
import { ChatFooter } from './ChatFooter'
import React from 'react'
import ReactMarkdown from 'react-markdown'

export function ChatBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex w-full gap-2',
        isUser ? 'flex-row-reverse' : 'flex-row',
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs',
          isUser
            ? 'bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900'
            : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed',
          isUser
            ? 'bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900'
            : 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100',
        )}
      >
        <ReactMarkdown
          components={{
            strong: ({ node, ...props }) => (
              <strong
                className={cn(
                  'font-bold',
                  isUser
                    ? 'text-white dark:text-zinc-950'
                    : 'text-zinc-950 dark:text-white'
                )}
                {...props}
              />
            ),
            a: ({ node, href, ...props }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'underline font-medium inline-flex items-center gap-0.5 transition-colors duration-200 hover:opacity-80',
                  isUser
                    ? 'text-blue-300 hover:text-blue-200 dark:text-blue-600 dark:hover:text-blue-800'
                    : 'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
                )}
                {...props}
              />
            ),
            p: ({ node, ...props }) => (
              <p className="text-sm leading-relaxed mb-2 last:mb-0" {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul className="list-disc pl-5 my-1.5 space-y-1" {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol className="list-decimal pl-5 my-1.5 space-y-1" {...props} />
            ),
            li: ({ node, ...props }) => (
              <li className="text-sm" {...props} />
            ),
            code: ({ node, ...props }) => (
              <code
                className={cn(
                  'px-1.5 py-0.5 rounded font-mono text-xs',
                  isUser
                    ? 'bg-zinc-800 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-800'
                    : 'bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200'
                )}
                {...props}
              />
            ),
          }}
        >
          {message.content}
        </ReactMarkdown>

        <ChatFooter message={message} />
      </div>
    </motion.div>
  )
}
