import { z } from 'zod'

/**
 * Maximum character length allowed for an individual chat message content.
 * Matches Story B boundary limit (N = 1000).
 */
export const MAX_MESSAGE_CONTENT_LENGTH = 1000

/**
 * Maximum number of messages allowed in a chat conversation payload.
 * Matches Story B boundary limit (M = 20).
 */
export const MAX_MESSAGES_COUNT = 20

/**
 * Generic error response message on payload rejection.
 * Must not echo user input back in the response body.
 */
export const INVALID_PAYLOAD_ERROR = 'Invalid request payload'

/**
 * Schema for an individual chat message.
 */
export const chatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1).max(MAX_MESSAGE_CONTENT_LENGTH),
})

/**
 * Schema for /api/chat payload.
 */
export const chatPayloadSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(MAX_MESSAGES_COUNT),
})

/**
 * Schema for /api/chat/suggested-prompts payload.
 * Accepts conversation history (0..20 messages) and prompt text.
 */
export const suggestedPromptsPayloadSchema = z
  .object({
    conversation: z
      .array(chatMessageSchema)
      .max(MAX_MESSAGES_COUNT)
      .optional()
      .default([]),
    lastMessage: z.string().min(1).max(MAX_MESSAGE_CONTENT_LENGTH).optional(),
    lastUserMessage: z
      .string()
      .min(1)
      .max(MAX_MESSAGE_CONTENT_LENGTH)
      .optional(),
  })
  .refine((data) => Boolean(data.lastMessage || data.lastUserMessage), {
    message: 'Either lastMessage or lastUserMessage is required',
  })

export type ChatMessage = z.infer<typeof chatMessageSchema>
export type ChatPayload = z.infer<typeof chatPayloadSchema>
export type SuggestedPromptsPayload = z.infer<
  typeof suggestedPromptsPayloadSchema
>

/**
 * Extracts the real visitor client IP from incoming request headers.
 * Looks for x-forwarded-for first (extracting the leftmost client IP),
 * and falls back to x-real-ip if absent.
 */
export function extractClientIp(request: Request): string | undefined {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor && forwardedFor.trim() !== '') {
    const firstIp = forwardedFor.split(',')[0].trim()
    if (firstIp) return firstIp
  }

  const realIp = request.headers.get('x-real-ip')
  if (realIp && realIp.trim() !== '') {
    return realIp.trim()
  }

  return undefined
}
