import 'server-only'
import { GoogleGenerativeAI } from '@google/generative-ai'

class GeminiServerError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'GeminiServerError'
  }
}

let _genai: GoogleGenerativeAI | null = null

export function getGemini(): GoogleGenerativeAI {
  if (!_genai) {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      throw new GeminiServerError('GEMINI_API_KEY_MISSING')
    }
    _genai = new GoogleGenerativeAI(apiKey)
  }
  return _genai
}

export function isGeminiConfigured(): boolean {
  return !!process.env.GEMINI_API_KEY
}
