import React from 'react'
import { createServerSupabase } from '../../../lib/supabaseServer'
import { notFound } from 'next/navigation'

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

  const scores = analysis.scores || {}
  const scoreKeys: { key: string; label: string; color: string }[] = [
    { key: 'fakeProbability', label: 'Risco de fake', color: 'bg-red-500' },
    { key: 'verifiableTruth', label: 'Verificavel', color: 'bg-green-500' },
    { key: 'biasFraming', label: 'Vies / Framing', color: 'bg-amber-500' },
    { key: 'manipulationRisk', label: 'Risco de manipulacao', color: 'bg-amber-500' },
  ]

  return (
    <main className="min-h-screen bg-white p-6 text-slate-800">
      <div className="max-w-3xl mx-auto">
        <a href="/" className="text-sm text-slate-500 hover:underline mb-4 inline-block">← Inicio</a>

        <h1 className="text-xl font-semibold mb-1">
          {analysis.verdict || 'Resultado'}
        </h1>
        <p className="text-xs text-slate-400 mb-6">
          {analysis.input_type} — {new Date(analysis.created_at).toLocaleString('pt-BR')}
        </p>

        {/* Score bars */}
        <div className="space-y-2 mb-6">
          {scoreKeys.map(({ key, label, color }) => {
            const value = scores[key] || 0
            return (
              <div key={key}>
                <div className="flex justify-between text-xs mb-1">
                  <span>{label}</span>
                  <span>{value}%</span>
                </div>
                <div className="h-2 bg-slate-200 rounded overflow-hidden">
                  <div className={`h-full rounded ${color}`} style={{ width: `${value}%` }} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Claims */}
        {analysis.claims && analysis.claims.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold mb-2">Afirmacoes analisadas</h2>
            <div className="space-y-2">
              {analysis.claims.map((c: any, i: number) => (
                <div key={i} className="border rounded p-3 text-xs">
                  <p className="font-medium">{c.claim}</p>
                  <p className="text-slate-500 mt-1">{c.assessment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Full report markdown */}
        {analysis.report_markdown && (
          <div className="border rounded-lg p-4 bg-slate-50">
            <h2 className="text-sm font-semibold mb-2">Relatorio completo</h2>
            <pre className="whitespace-pre-wrap text-xs text-slate-600">{analysis.report_markdown}</pre>
          </div>
        )}
      </div>
    </main>
  )
}
