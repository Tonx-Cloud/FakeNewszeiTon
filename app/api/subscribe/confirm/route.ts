import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabaseServer'
import { verifySignedToken } from '@/lib/tokens'

interface ConfirmPayload {
  purpose: string
  email: string
  name: string | null
  whatsapp: string | null
  acceptedTermsAt: string
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://fakenewsverificaton.com.br'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const token = url.searchParams.get('token') || ''

  const payload = verifySignedToken<ConfirmPayload>(token)
  if (!payload || payload.purpose !== 'subscribe-confirm') {
    return htmlResponse('Token inválido ou expirado', 'O link de confirmação é inválido ou já expirou. Tente se inscrever novamente.', false)
  }

  try {
    const supabase = createServerSupabase()

    // Check if already exists
    const { data: existing } = await supabase
      .from('subscribers')
      .select('id')
      .eq('email', payload.email)
      .maybeSingle()

    if (existing) {
      await supabase.from('subscribers').update({
        last_active: new Date().toISOString(),
        name: payload.name || undefined,
        whatsapp: payload.whatsapp || undefined,
      }).eq('id', existing.id)
      return htmlResponse('Inscrição confirmada!', 'Você já estava inscrito. Seus dados foram atualizados.', true)
    }

    // Insert confirmed subscriber
    const { error } = await supabase.from('subscribers').insert({
      name: payload.name,
      email: payload.email,
      whatsapp: payload.whatsapp,
      accepted_terms_at: payload.acceptedTermsAt,
    })

    if (error) {
      console.error('Confirm insert error:', error)
      return htmlResponse('Erro ao confirmar', 'Ocorreu um erro ao salvar sua inscrição. Tente novamente.', false)
    }

    return htmlResponse('Inscrição confirmada! ✅', 'Sua inscrição foi ativada com sucesso. Você receberá alertas de desinformação.', true)
  } catch (err) {
    console.error('Confirm error:', err)
    return htmlResponse('Erro interno', 'Ocorreu um erro inesperado. Tente novamente.', false)
  }
}

function htmlResponse(title: string, message: string, success: boolean) {
  const color = success ? '#16a34a' : '#dc2626'
  const icon = success ? '✅' : '⚠️'

  return new Response(
    `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} — Fake News VerificaTon</title>
<style>
  body{font-family:system-ui,'Segoe UI',sans-serif;background:#0f172a;color:#e2e8f0;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:24px}
  .card{background:#1e293b;border-radius:20px;padding:48px 32px;text-align:center;max-width:420px;box-shadow:0 20px 40px rgba(0,0,0,.3)}
  .icon{font-size:48px;margin-bottom:16px}
  h1{font-size:22px;margin:0 0 12px;color:${color}}
  p{font-size:14px;color:#94a3b8;line-height:1.6;margin:0 0 24px}
  a{display:inline-block;padding:12px 24px;background:#1d9bf0;color:#fff;border-radius:12px;text-decoration:none;font-weight:600;font-size:14px;transition:background .2s}
  a:hover{background:#0d8de0}
</style></head>
<body><div class="card">
  <div class="icon">${icon}</div>
  <h1>${title}</h1>
  <p>${message}</p>
  <a href="${APP_URL}">Voltar ao Fake News VerificaTon</a>
</div></body></html>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } },
  )
}
