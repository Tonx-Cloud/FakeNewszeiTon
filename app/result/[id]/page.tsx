import React from 'react'
import { createServerSupabase } from '../../../lib/supabaseServer'
import { notFound } from 'next/navigation'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ResultContent from './ResultContent'

export const dynamic = 'force-dynamic'

type Props = { params: { id: string } }

export default async function ResultPage({ params }: Props) {
  const id = params.id
  const supabase = createServerSupabase()

  const { data: analysis } = await supabase
    .from('analyses')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (!analysis) return notFound()

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors">
      <Nav />
      <ResultContent analysis={analysis} />
      <Footer />
    </main>
  )
}
