import crypto from 'crypto'

const SECRET = process.env.UNSUB_SECRET || process.env.TOKEN_SECRET || 'default-dev-secret-change-me'

/**
 * Create a signed token encoding arbitrary JSON payload + expiry.
 * Format: base64url(JSON).hmac_hex
 */
export function createSignedToken(payload: Record<string, unknown>, expiresInMs = 48 * 60 * 60 * 1000): string {
  const data = { ...payload, exp: Date.now() + expiresInMs }
  const encoded = Buffer.from(JSON.stringify(data)).toString('base64url')
  const sig = crypto.createHmac('sha256', SECRET).update(encoded).digest('hex')
  return `${encoded}.${sig}`
}

/**
 * Verify and decode a signed token.
 * Returns the payload if valid and not expired, otherwise null.
 */
export function verifySignedToken<T = Record<string, unknown>>(token: string): T | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 2) return null

    const [encoded, sig] = parts
    const expectedSig = crypto.createHmac('sha256', SECRET).update(encoded).digest('hex')
    if (!crypto.timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expectedSig, 'hex'))) return null

    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'))
    if (typeof payload.exp === 'number' && Date.now() > payload.exp) return null

    return payload as T
  } catch {
    return null
  }
}
