'use client'

import { Turnstile } from 'react-turnstile'
import { useState, useCallback } from 'react'

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''

type CaptchaStatus = 'idle' | 'verified' | 'expired' | 'error'

interface CaptchaProps {
  /** Called with the token string on successful verification */
  onVerify: (token: string) => void
  /** Called when the token expires */
  onExpire?: () => void
  /** Called with an error message on failure */
  onError?: (msg: string) => void
  /** Increment to force a re-render / reset */
  resetKey?: number
  className?: string
}

/**
 * Reusable Cloudflare Turnstile CAPTCHA component.
 * Uses the `react-turnstile` package for integration.
 *
 * If NEXT_PUBLIC_TURNSTILE_SITE_KEY is not set, renders nothing (dev mode).
 */
export default function Captcha({
  onVerify,
  onExpire,
  onError,
  resetKey = 0,
  className = '',
}: CaptchaProps) {
  const [status, setStatus] = useState<CaptchaStatus>('idle')

  // Skip if no site key configured (dev mode)
  if (!SITE_KEY) return null

  const handleVerify = useCallback(
    (token: string) => {
      setStatus('verified')
      onVerify(token)
    },
    [onVerify],
  )

  const handleExpire = useCallback(() => {
    setStatus('expired')
    onExpire?.()
  }, [onExpire])

  const handleError = useCallback(() => {
    setStatus('error')
    onError?.('Não foi possível validar o CAPTCHA. Tente novamente.')
  }, [onError])

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <Turnstile
        key={resetKey}
        sitekey={SITE_KEY}
        onVerify={handleVerify}
        onExpire={handleExpire}
        onError={handleError}
        theme="auto"
        size="flexible"
      />

      {status === 'expired' && (
        <p className="text-xs text-amber-600 dark:text-amber-400 animate-fade-in">
          ⏳ CAPTCHA expirou. Refaça a validação.
        </p>
      )}
      {status === 'error' && (
        <p className="text-xs text-red-600 dark:text-red-400 animate-fade-in">
          ⚠️ Não foi possível validar o CAPTCHA. Tente novamente.
        </p>
      )}
    </div>
  )
}
