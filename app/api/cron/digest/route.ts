import { NextResponse } from 'next/server'
import { buildDigestEmailPayload, sendEmail } from '../../../../lib/resend'
import { createServerSupabase } from '../../../../lib/supabaseServer'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const key = url.searchParams.get('key') || ''
  if (!process.env.CRON_SECRET || key !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  // Minimal digest: fetch profiles with notify_enabled
  const supabase = createServerSupabase()
  const { data: users } = await supabase.from('profiles').select('*').eq('notify_enabled', true)

  if (!users || users.length === 0) {
    return NextResponse.json({ ok: true, sent: 0 })
  }

  // For MVP: pick top trending items
  const { data: items } = await supabase.from('trending_items').select('*').order('score_fake_probability', { ascending: false }).limit(10)

  // send emails via Resend
  let sent = 0
  for (const u of users) {
    const body = buildDigestEmailPayload(u.email, items || [], u.notify_frequency || 'daily')
    try {
      await sendEmail(body)
      sent++
    } catch (e) {
      console.error('send fail', e)
    }
  }

  return NextResponse.json({ ok: true, sent })
}
