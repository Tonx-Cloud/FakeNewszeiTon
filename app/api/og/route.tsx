import { ImageResponse } from '@vercel/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f1419 0%, #1a1f2e 50%, #0f172a 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
        }}
      >
        {/* Subtle grid pattern overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle at 25% 25%, rgba(29,155,240,0.08) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(29,155,240,0.05) 0%, transparent 50%)',
            display: 'flex',
          }}
        />

        {/* Logo icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 80,
            height: 80,
            borderRadius: 20,
            background: 'rgba(29,155,240,0.15)',
            border: '2px solid rgba(29,155,240,0.3)',
            marginBottom: 24,
            fontSize: 40,
          }}
        >
          🔍
        </div>

        {/* Brand name */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 12,
            marginBottom: 16,
          }}
        >
          <span style={{ fontSize: 52, fontWeight: 700, color: '#e2e8f0', letterSpacing: '-0.02em' }}>
            Fake
          </span>
          <span style={{ fontSize: 52, fontWeight: 700, color: '#1d9bf0', letterSpacing: '-0.02em' }}>
            News
          </span>
          <span style={{ fontSize: 52, fontWeight: 700, color: '#e2e8f0', letterSpacing: '-0.02em' }}>
            VerificaTon
          </span>
        </div>

        {/* Tagline */}
        <p
          style={{
            fontSize: 22,
            color: '#94a3b8',
            margin: 0,
            fontWeight: 400,
            letterSpacing: '0.01em',
          }}
        >
          Verifique antes de compartilhar
        </p>

        {/* Divider */}
        <div
          style={{
            width: 120,
            height: 2,
            background: 'linear-gradient(90deg, transparent, #1d9bf0, transparent)',
            margin: '24px 0',
            display: 'flex',
          }}
        />

        {/* Features */}
        <div
          style={{
            display: 'flex',
            gap: 32,
            fontSize: 15,
            color: '#64748b',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>⚡ Análise por IA</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>🛡️ Gratuito</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>⚖️ Apartidário</span>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'linear-gradient(90deg, #1d9bf0, #6366f1, #1d9bf0)',
            display: 'flex',
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
