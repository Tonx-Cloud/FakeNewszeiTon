import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabaseServer'
import { checkRateLimitAsync } from '@/lib/rateLimitUpstash'
import { subscribeSchema } from '@/lib/validations'
import { createSignedToken } from '@/lib/tokens'
import { buildConfirmationEmail, sendEmail } from '@/lib/resend'

export async function POST(req: Request) {
  try {
    // ── Rate limit ──
    const forwarded = req.headers.get('x-forwarded-for')
    const ip = forwarded?.split(',')[0]?.trim() || 'unknown'
    const rl = await checkRateLimitAsync(`sub:${ip}`)
    if (!rl.allowed) {
      return NextResponse.json(
        { ok: false, error: 'RATE_LIMITED', message: 'Muitas requisições. Aguarde um minuto.' },
        { status: 429, headers: { 'Retry-After': '60' } },
      )
    }

    const body = await req.json()

    // ── Validate with Zod ──
    const parsed = subscribeSchema.safeParse(body)
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message || 'Dados inválidos.'
      return NextResponse.json(
        { ok: false, error: 'VALIDATION', message: firstError },
        { status: 400 },
      )
    }

    const { name, email, whatsapp } = parsed.data
    const supabase = createServerSupabase()

    // Check if already subscribed
    const { data: existing } = await supabase
      .from('subscribers')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (existing) {
      // Update last_active and optional fields
      await supabase.from('subscribers').update({
        last_active: new Date().toISOString(),
        name: name || undefined,
        whatsapp: whatsapp || undefined,
      }).eq('id', existing.id)
      return NextResponse.json({ ok: true, message: 'Você já está inscrito. Cadastro atualizado!' })
    }

    // ── Double opt-in: generate signed token with subscriber data ──
    const token = createSignedToken({
      purpose: 'subscribe-confirm',
      email,
      name: name || null,
      whatsapp: whatsapp || null,
      acceptedTermsAt: new Date().toISOString(),
    })

    // ── Send confirmation email ──
    const emailPayload = buildConfirmationEmail(email, token, name)
    await sendEmail(emailPayload)

    return NextResponse.json({
      ok: true,
      message: 'Enviamos um e-mail de confirmação. Verifique sua caixa de entrada (e spam) para ativar a inscrição.',
    })
  } catch (err) {
    console.error('Subscribe error:', err)
    return NextResponse.json(
      { ok: false, error: 'INTERNAL', message: 'Erro interno do servidor.' },
      { status: 500 },
    )
  }
}
