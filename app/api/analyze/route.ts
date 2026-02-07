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
    return NextResponse.json({ error: err?.message || String(err) }, { status: 400 })
  }
}
