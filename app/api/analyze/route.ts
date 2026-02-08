import { NextResponse } from 'next/server'
import { z } from 'zod'
import { isGeminiConfigured } from '../../../lib/gemini'
import { analyzePipeline } from '../../../lib/analyzePipeline'
import { createServerSupabase } from '../../../lib/supabaseServer'
import { checkRateLimit } from '../../../lib/rateLimit'

export const runtime = "nodejs"

// Max payload ~4.5 MB (base64 images/audio)
const MAX_CONTENT_LENGTH = 4_500_000

const BodySchema = z.object({
  inputType: z.enum(['text', 'link', 'image', 'audio']),
  content: z.string().max(MAX_CONTENT_LENGTH, 'Conteudo excede o limite de ~4.5 MB')
})

export async function POST(req: Request) {
  try {
    // Rate limiting by IP
    const forwarded = req.headers.get('x-forwarded-for')
    const ip = forwarded?.split(',')[0]?.trim() || 'unknown'
    const rl = checkRateLimit(ip)
    if (!rl.allowed) {
      return NextResponse.json({
        ok: false,
        error: 'RATE_LIMITED',
        message: 'Muitas requisicoes. Aguarde um minuto.'
      }, { status: 429, headers: { 'Retry-After': '60' } })
    }

    if (!isGeminiConfigured()) {
      console.error("[api/analyze] GEMINI_API_KEY not configured")
      return NextResponse.json({
        ok: false,
        error: "SERVER_MISCONFIG",
        message: "GEMINI_API_KEY nao configurada no servidor (Vercel)."
      }, { status: 503 })
    }

    const body = await req.json()
    const parsed = BodySchema.parse(body)

    const result = await analyzePipeline(parsed.inputType, parsed.content)

    // Persist analysis to Supabase (best-effort, don't block response)
    try {
      const supabase = createServerSupabase()
      const inputSummary = parsed.content.slice(0, 500)
      await supabase.from('analyses').insert({
        input_type: parsed.inputType,
        input_summary: inputSummary,
        scores: result.scores,
        verdict: result.summary?.verdict || 'Inconclusivo',
        report_markdown: result.reportMarkdown,
        claims: result.claims || [],
        fingerprint: result.meta?.fingerprint || null,
        is_flagged: (result.scores?.fakeProbability || 0) >= 70
      })
    } catch (dbErr) {
      console.error("[api/analyze] Supabase insert failed (non-blocking):", dbErr)
    }

    // Update trending_items aggregation (best-effort)
    try {
      const supabase = createServerSupabase()
      const fp = result.meta?.fingerprint
      if (fp && result.summary?.headline) {
        const { data: existing } = await supabase
          .from('trending_items')
          .select('id, occurrences')
          .eq('fingerprint', fp)
          .maybeSingle()

        if (existing) {
          await supabase.from('trending_items').update({
            occurrences: (existing.occurrences || 1) + 1,
            last_seen: new Date().toISOString(),
            score_fake_probability: result.scores?.fakeProbability || 0
          }).eq('id', existing.id)
        } else {
          await supabase.from('trending_items').insert({
            title: result.summary.headline,
            reason: result.summary.oneParagraph?.slice(0, 300) || '',
            fingerprint: fp,
            sample_claims: (result.claims || []).slice(0, 3),
            score_fake_probability: result.scores?.fakeProbability || 0,
            occurrences: 1,
            last_seen: new Date().toISOString()
          })
        }
      }
    } catch (trendErr) {
      console.error("[api/analyze] trending update failed (non-blocking):", trendErr)
    }

    return NextResponse.json(result)
  } catch (err: any) {
    console.error("[api/analyze] error:", err)
    return NextResponse.json({
      ok: false,
      error: "ANALYZE_FAILED",
      message: "Falha ao analisar no servidor. Tente novamente."
    }, { status: 500 })
  }
}
