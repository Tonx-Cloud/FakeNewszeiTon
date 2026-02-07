import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createServerSupabase } from '../../../lib/supabaseServer'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const token = url.searchParams.get('token') || ''
    if (!process.env.UNSUB_SECRET) return NextResponse.json({ error: 'server misconfigured' }, { status: 500 })

    // token = HMAC(userId|expiry)
    const parts = token.split('.')
    if (parts.length !== 2) return NextResponse.json({ error: 'invalid token' }, { status: 400 })
    const payload = Buffer.from(parts[0], 'base64').toString('utf8')
    const sig = parts[1]
    const h = crypto.createHmac('sha256', process.env.UNSUB_SECRET).update(parts[0]).digest('hex')
    if (h !== sig) return NextResponse.json({ error: 'invalid signature' }, { status: 400 })

    const data = JSON.parse(payload)
    const { userId, exp } = data
    if (Date.now() > exp) return NextResponse.json({ error: 'token expired' }, { status: 400 })

    const supabase = createServerSupabase()
    await supabase.from('profiles').update({ notify_enabled: false }).eq('id', userId)

    return new Response('<html><body><h1>Notificações desativadas</h1></body></html>', { headers: { 'Content-Type': 'text/html' } })
  } catch (e) {
    return NextResponse.json({ error: 'fail' }, { status: 500 })
  }
}
