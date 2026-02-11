import 'server-only'

const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY || ''
const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export interface TurnstileResult {
  success: boolean
  errorCodes: string[]
}

/**
 * Verify a Cloudflare Turnstile token server-side.
 * Returns { success: true } if valid, { success: false, errorCodes } otherwise.
 *
 * If TURNSTILE_SECRET_KEY is not configured, all requests pass (dev mode).
 */
export async function verifyTurnstile(token: string | undefined, ip?: string): Promise<TurnstileResult> {
  // Trim secret to handle potential trailing newlines from env var piping
  const secret = TURNSTILE_SECRET.trim()

  // Dev mode: skip verification if secret not configured
  if (!secret) {
    console.warn('[turnstile] TURNSTILE_SECRET_KEY not configured — skipping verification (dev mode)')
    return { success: true, errorCodes: [] }
  }

  // Diagnostic logging
  console.log(`[turnstile] Secret key present: ${secret.length} chars, starts with: ${secret.substring(0, 6)}...`)
  console.log(`[turnstile] Token present: ${!!token}, length: ${token?.length ?? 0}, first 20: ${token?.substring(0, 20) ?? 'N/A'}`)

  if (!token) {
    console.warn('[turnstile] Token is missing!')
    return { success: false, errorCodes: ['missing-input-response'] }
  }

  try {
    const body: Record<string, string> = {
      secret,
      response: token,
    }
    if (ip) body.remoteip = ip

    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      console.error(`[turnstile] API returned HTTP ${res.status}`)
      return { success: false, errorCodes: [`http-${res.status}`] }
    }

    const data = await res.json() as { success: boolean; 'error-codes'?: string[]; hostname?: string; action?: string }

    console.log(`[turnstile] Verification result: success=${data.success}, errors=${JSON.stringify(data['error-codes'] || [])}, hostname=${data.hostname || 'N/A'}`)

    return {
      success: data.success,
      errorCodes: data['error-codes'] || [],
    }
  } catch (err: any) {
    console.error('[turnstile] Verification error:', err?.message)
    return { success: false, errorCodes: ['network-error'] }
  }
}
