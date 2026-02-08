import 'server-only'
import OpenAI from 'openai'

/**
 * OpenAI client for server-side use only.
 * This module should NEVER be imported in client components.
 * The 'server-only' package ensures this module won't be bundled for the client.
 */

class OpenAIServerError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'OpenAIServerError'
  }
}

let _openai: OpenAI | null = null

export function getOpenAI(): OpenAI {
  if (!_openai) {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new OpenAIServerError('OPENAI_API_KEY_MISSING')
    }
    _openai = new OpenAI({ apiKey })
  }
  return _openai
}

export function isOpenAIConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY
}
