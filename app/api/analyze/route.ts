import { NextResponse } from 'next/server'
import { z } from 'zod'
import { analyzePipeline } from '../../../lib/analyzePipeline'

const BodySchema = z.object({
  inputType: z.enum(['text', 'link', 'image', 'audio']),
  content: z.string()
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = BodySchema.parse(body)

    const result = await analyzePipeline(parsed.inputType, parsed.content)

    return NextResponse.json(result)
  } catch (err: any) {
    // Handle OpenAI API key missing
    if (err?.message === 'OPENAI_API_KEY_MISSING' || err?.name === 'OpenAIServerError') {
      return NextResponse.json({
        ok: false,
        error: 'SERVER_MISCONFIG',
        message: 'Chave da OpenAI nao configurada no servidor. Configure OPENAI_API_KEY nas variaveis de ambiente.'
      }, { status: 503 })
    }

    // Handle other errors
    console.error('Analyze error:', err)
    return NextResponse.json({
      ok: false,
      error: 'ANALYZE_FAILED',
      message: err?.message || 'Erro ao processar analise'
    }, { status: 500 })
  }
}
