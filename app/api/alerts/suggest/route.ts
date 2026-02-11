import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabaseServer'
import { checkRateLimitAsync } from '@/lib/rateLimitUpstash'
import { alertsSuggestSchema } from '@/lib/validations'

export async function POST(req: Request) {
  try {
    // ── Rate limit ──
    const forwarded = req.headers.get('x-forwarded-for')
    const ip = forwarded?.split(',')[0]?.trim() || 'unknown'
    const rl = await checkRateLimitAsync(`suggest:${ip}`)
    if (!rl.allowed) {
      return NextResponse.json(
        { ok: false, error: 'RATE_LIMITED', message: 'Muitas requisições. Aguarde um minuto.' },
        { status: 429, headers: { 'Retry-After': '60' } },
      )
    }

    const body = await req.json()

    // ── Validate with Zod ──
    const parsed = alertsSuggestSchema.safeParse(body)
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message || 'Dados inválidos.'
      return NextResponse.json(
        { ok: false, error: 'VALIDATION', message: firstError },
        { status: 400 },
      )
    }

    const { title, description } = parsed.data
    const supabase = createServerSupabase()

    // ── Insert suggestion as a trending item candidate ──
    const { error } = await supabase.from('trending_items').insert({
      title,
      reason: description || '',
      fingerprint: `suggest:${Date.now()}`,
      occurrences: 1,
      score_fake_probability: 0,
      last_seen: new Date().toISOString(),
    })

    if (error) {
      console.error('[alerts/suggest] insert error:', error)
      return NextResponse.json(
        { ok: false, error: 'DB_ERROR', message: 'Erro ao salvar sugestão. Tente novamente.' },
        { status: 500 },
      )
    }

    return NextResponse.json({
      ok: true,
      message: 'Sugestão registrada! Ela aparecerá nos alertas após verificação.',
    })
  } catch (err) {
    console.error('[alerts/suggest] error:', err)
    return NextResponse.json(
      { ok: false, error: 'INTERNAL', message: 'Erro interno do servidor.' },
      { status: 500 },
    )
  }
}
