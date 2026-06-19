import { Calendar, ExternalLink, Loader2, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { Message } from '@/context/ChatContext'
import { useChatContext } from '@/context/ChatContext'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { highlight } from 'sugar-high'


function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text', err)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 text-[10px] text-zinc-500 hover:text-zinc-800 transition-colors dark:text-zinc-400 dark:hover:text-zinc-200 cursor-pointer"
      title="Copy to clipboard"
    >
      {copied ? (
        <>
          <Check className="h-3 w-3 text-emerald-500" />
          <span className="text-emerald-500">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="h-3 w-3" />
          <span>Copy</span>
        </>
      )}
    </button>
  )
}

function CalendarWidget({ url }: { url: string }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [iframeLoading, setIframeLoading] = useState(true)

  return (
    <div className="mt-3 overflow-hidden rounded-[20px] border border-zinc-100 bg-white p-5 shadow-[0_4px_12px_rgba(0,0,0,0.02)] dark:border-zinc-850 dark:bg-zinc-950">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
          <Calendar className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-50">
            Book a Meeting
          </h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
            Select a slot that fits your schedule via Cal.com.
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => {
            setIsExpanded(!isExpanded)
            if (!isExpanded) setIframeLoading(true)
          }}
          className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-zinc-800 active:scale-95 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 cursor-pointer"
        >
          {isExpanded ? (
            <>
              Hide Calendar <ChevronUp className="h-3.5 w-3.5" />
            </>
          ) : (
            <>
              Book Inline <ChevronDown className="h-3.5 w-3.5" />
            </>
          )}
        </button>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-600 shadow-sm transition-all hover:bg-zinc-50 dark:border-zinc-750 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 cursor-pointer"
        >
          Open in New Tab <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      {isExpanded && (
        <div className="relative mt-3 h-[380px] w-full overflow-hidden rounded-xl border border-zinc-100 bg-white dark:border-zinc-850">
          {iframeLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-50/50 dark:bg-zinc-900/50">
              <Loader2 className="h-6 w-6 animate-spin text-zinc-400 dark:text-zinc-650" />
            </div>
          )}
          <iframe
            src={`${url}?embed=true`}
            className="h-full w-full border-0"
            title="Schedule a session"
            onLoad={() => setIframeLoading(false)}
          />
        </div>
      )}
    </div>
  )
}

const dotVariants = {
  initial: { y: 0, opacity: 0.4 },
  animate: {
    y: [0, -5, 0],
    opacity: [0.4, 1, 0.4],
  },
}

export function ChatBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'
  const { isLoading, messages } = useChatContext()

  const isLastMessage = messages[messages.length - 1]?.id === message.id
  const isStreaming = isLoading && isLastMessage && !isUser

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex w-full gap-3',
        isUser ? 'flex-row-reverse' : 'flex-row',
      )}
    >
      {/* Avatar */}
      {isUser ? (
        <motion.div
          initial={{ rotate: -45, scale: 0.3, y: 15 }}
          animate={{ rotate: 0, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 15 }}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-base border bg-zinc-100 dark:bg-zinc-850 border-zinc-200/80 dark:border-zinc-700/60 shadow-sm shadow-zinc-100/30 dark:shadow-none select-none"
          title="User Avatar"
        >
          {'🍗'}
        </motion.div>
      ) : (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full overflow-hidden border border-zinc-100 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <img src="/grizz-bot.png" alt="Grizz" className="h-full w-full object-cover" />
        </div>
      )}

      {/* Bubble */}
      <div
        className={cn(
          'max-w-[85%] rounded-[20px] px-5 py-3 text-sm leading-relaxed',
          isUser
            ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950'
            : 'bg-zinc-50 border border-zinc-100/80 text-zinc-900 dark:border-zinc-800/85 dark:bg-zinc-900 dark:text-zinc-100',
        )}
      >
        {!message.content ? (
          isStreaming ? (
            <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-700 select-none" aria-label="Grizz is thinking...">
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                Thinking
              </motion.span>
              <span className="flex items-center gap-1 mt-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500"
                    variants={dotVariants}
                    initial="initial"
                    animate="animate"
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </span>
            </div>
          ) : (
            <div className="text-zinc-400 italic">Empty response.</div>
          )
        ) : (
          <ReactMarkdown
            components={{
              strong: ({ node, ...props }) => (
                <strong
                  className={cn(
                    'font-semibold',
                    isUser
                      ? 'text-white dark:text-black'
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
                      ? 'text-zinc-200 hover:text-white dark:text-zinc-800 dark:hover:text-black'
                      : 'text-zinc-900 hover:text-black dark:text-white dark:hover:text-zinc-300'
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
              code: ({ node, className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || '')
                const isBlock = !!match || String(children).includes('\n')
                const codeString = String(children).replace(/\n$/, '')

                if (isBlock) {
                  const highlighted = highlight(codeString)
                  return (
                    <div className="relative my-2 w-full rounded-[16px] border border-zinc-100 bg-zinc-50/70 font-mono text-xs overflow-hidden dark:border-zinc-850 dark:bg-zinc-900/50">
                      <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-2 bg-zinc-100/40 text-[10px] text-zinc-400 font-semibold uppercase tracking-wider dark:border-zinc-850 dark:bg-zinc-950/40 dark:text-zinc-500">
                        <span>{match ? match[1] : 'code'}</span>
                        <CopyButton text={codeString} />
                      </div>
                      <pre className="p-4 overflow-x-auto whitespace-pre leading-relaxed">
                        <code
                          dangerouslySetInnerHTML={{ __html: highlighted }}
                          className="block"
                        />
                      </pre>
                    </div>
                  )
                }

                return (
                  <code
                    className={cn(
                      'px-1.5 py-0.5 rounded font-mono text-xs',
                      isUser
                        ? 'bg-zinc-800 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-800'
                        : 'bg-zinc-50 text-zinc-800 border border-zinc-100 dark:bg-zinc-800 dark:border-zinc-800 dark:text-zinc-200'
                    )}
                    {...props}
                  >
                    {children}
                  </code>
                )
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        )}

        {/* Calendar Widget */}
        {!isUser && message.uiWidget?.type === 'calendar' && (
          <CalendarWidget url={message.uiWidget.url} />
        )}
      </div>
    </motion.div>
  )
}
