import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabaseServer'
import { checkRateLimitAsync } from '@/lib/rateLimitUpstash'
import { verifyTurnstile } from '@/lib/auth/turnstile'
import { createSignedToken } from '@/lib/tokens'
import { buildCancelConfirmationEmail, sendEmail } from '@/lib/resend'
import { z } from 'zod'

const cancelSchema = z.object({
  email: z.string().email('E-mail inválido.'),
  turnstileToken: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    // ── Rate limit ──
    const forwarded = req.headers.get('x-forwarded-for')
    const ip = forwarded?.split(',')[0]?.trim() || 'unknown'
    const rl = await checkRateLimitAsync(`unsub:${ip}`)
    if (!rl.allowed) {
      return NextResponse.json(
        { ok: false, error: 'RATE_LIMITED', message: 'Muitas requisições. Aguarde um minuto.' },
        { status: 429, headers: { 'Retry-After': '60' } },
      )
    }

    const body = await req.json()

    // ── Turnstile ──
    const captcha = await verifyTurnstile(body.turnstileToken, ip)
    if (!captcha.success) {
      return NextResponse.json(
        { ok: false, error: 'CAPTCHA_FAILED', message: 'Verificação anti-bot falhou. Recarregue a página.' },
        { status: 403 },
      )
    }

    // ── Validate ──
    const parsed = cancelSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: 'VALIDATION', message: parsed.error.errors[0]?.message || 'Dados inválidos.' },
        { status: 400 },
      )
    }

    const { email } = parsed.data
    const supabase = createServerSupabase()

    // Check if subscriber exists
    const { data: existing } = await supabase
      .from('subscribers')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    // Always return success to avoid email enumeration
    if (!existing) {
      return NextResponse.json({
        ok: true,
        message: 'Se esse e-mail estiver cadastrado, enviaremos um link de confirmação de cancelamento.',
      })
    }

    // Generate cancel token
    const token = createSignedToken({
      purpose: 'subscribe-cancel',
      email,
      subscriberId: existing.id,
    })

    // Send cancel confirmation email
    const emailPayload = buildCancelConfirmationEmail(email, token)
    await sendEmail(emailPayload)

    return NextResponse.json({
      ok: true,
      message: 'Se esse e-mail estiver cadastrado, enviaremos um link de confirmação de cancelamento.',
    })
  } catch (err) {
    console.error('Cancel error:', err)
    return NextResponse.json(
      { ok: false, error: 'INTERNAL', message: 'Erro interno do servidor.' },
      { status: 500 },
    )
  }
}
