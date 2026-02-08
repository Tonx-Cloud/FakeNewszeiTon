import 'server-only'

/**
 * OpenAI client for server-side use only.
 * This module should NEVER be imported in client components.
 */

let _openai: any = null

class OpenAIServerError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'OpenAIServerError'
  }
}

export function getOpenAI() {
  if (!_openai) {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new OpenAIServerError('OPENAI_API_KEY_MISSING')
    }
    // Dynamically import OpenAI to avoid bundling in client
    const OpenAI = require('openai').OpenAI
    _openai = new OpenAI({ apiKey })
  }
  return _openai
}

export function isOpenAIConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY
}
