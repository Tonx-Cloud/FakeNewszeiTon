const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://fakenewsverificaton.com.br'
const FROM = process.env.RESEND_FROM_EMAIL || process.env.FROM_EMAIL || 'onboarding@resend.dev'

/* ── Shared styles ── */
const EMAIL_STYLE = `font-family:system-ui,'Segoe UI',Arial,sans-serif;color:#1e293b;background:#f8fafc;padding:32px 24px;max-width:560px;margin:0 auto`
const BTN_STYLE = `display:inline-block;padding:14px 28px;background:#1d9bf0;color:#fff;border-radius:12px;text-decoration:none;font-weight:600;font-size:15px`

function emailShell(body: string) {
  return `<html><body style="${EMAIL_STYLE}">
    <div style="text-align:center;margin-bottom:24px">
      <strong style="font-size:18px;color:#0f1419">🔍 Fake News VerificaTon</strong>
    </div>
    ${body}
    <hr style="border:none;border-top:1px solid #e2e8f0;margin:28px 0 16px"/>
    <p style="font-size:11px;color:#94a3b8;text-align:center">
      Fake News VerificaTon — Análise assistida por IA. Não substitui fact-checking profissional.<br/>
      <a href="${APP_URL}/privacy" style="color:#64748b">Política de Privacidade</a> · <a href="${APP_URL}/terms" style="color:#64748b">Termos de Uso</a>
    </p>
  </body></html>`
}

/* ── Confirmation email (double opt-in) ── */
export function buildConfirmationEmail(to: string, token: string, name?: string | null) {
  const link = `${APP_URL}/api/subscribe/confirm?token=${encodeURIComponent(token)}`
  const greeting = name ? `Olá, ${name}!` : 'Olá!'

  return {
    from: FROM,
    to,
    subject: 'Confirme sua inscrição — Fake News VerificaTon',
    html: emailShell(`
      <h2 style="text-align:center;margin:0 0 16px">${greeting}</h2>
      <p style="text-align:center;font-size:14px;line-height:1.6">
        Recebemos seu pedido de inscrição nos alertas de desinformação.<br/>
        Clique no botão abaixo para confirmar:
      </p>
      <p style="text-align:center;margin:24px 0">
        <a href="${link}" style="${BTN_STYLE}">✅ Confirmar inscrição</a>
      </p>
      <p style="text-align:center;font-size:12px;color:#64748b">
        Se você não solicitou esta inscrição, ignore este e-mail.<br/>
        O link expira em 48 horas.
      </p>
    `),
  }
}

/* ── Cancel confirmation email ── */
export function buildCancelConfirmationEmail(to: string, token: string) {
  const link = `${APP_URL}/api/subscribe/cancel/confirm?token=${encodeURIComponent(token)}`

  return {
    from: FROM,
    to,
    subject: 'Confirme o cancelamento — Fake News VerificaTon',
    html: emailShell(`
      <h2 style="text-align:center;margin:0 0 16px">Cancelar inscrição</h2>
      <p style="text-align:center;font-size:14px;line-height:1.6">
        Recebemos sua solicitação de cancelamento dos alertas.<br/>
        Clique no botão abaixo para confirmar a remoção dos seus dados:
      </p>
      <p style="text-align:center;margin:24px 0">
        <a href="${link}" style="${BTN_STYLE.replace('#1d9bf0', '#475569')}">🚫 Confirmar cancelamento</a>
      </p>
      <p style="text-align:center;font-size:12px;color:#64748b">
        Se você não solicitou o cancelamento, ignore este e-mail.<br/>
        O link expira em 48 horas.
      </p>
    `),
  }
}

/* ── Digest email (trending fakes) ── */
export function buildDigestEmailPayload(to: string, items: any[], frequency: string) {
  const subject = frequency === 'weekly'
    ? 'Fake News VerificaTon — Fakes em alta (semana)'
    : 'Fake News VerificaTon — Fakes em alta (últimas 24h)'

  const rows = (items || [])
    .slice(0, frequency === 'weekly' ? 10 : 5)
    .map((it: any, i: number) =>
      `<li><strong>${i + 1}. ${it.title}</strong><br/>${it.reason || ''}<br/>Visto ${it.occurrences} vezes — Última: ${it.last_seen}</li>`
    ).join('')

  return {
    from: FROM,
    to,
    subject,
    html: emailShell(`
      <h2 style="text-align:center;margin:0 0 16px">Fakes em alta</h2>
      <ol style="padding-left:20px;font-size:14px;line-height:1.8">${rows}</ol>
      <p style="text-align:center;margin:20px 0">
        <a href="${APP_URL}/alerts" style="${BTN_STYLE}">Ver todos os alertas</a>
      </p>
      <p style="text-align:center;margin:20px 0">
        <a href="${APP_URL}/subscribe" style="font-size:12px;color:#64748b">Cancelar inscrição</a>
      </p>
    `),
  }
}

/* ── Generic send via Resend API ── */
export async function sendEmail(payload: { from: string; to: string; subject: string; html: string }) {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('RESEND_API_KEY not configured')

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`resend send failed: ${res.status} ${txt}`)
  }

  return res.json()
}
