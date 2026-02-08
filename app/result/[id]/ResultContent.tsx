'use client'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

interface ResultContentProps {
  analysis: any
}

const scoreKeys = [
  { key: 'fakeProbability', label: 'Risco de fake', color: 'bg-red-500' },
  { key: 'verifiableTruth', label: 'Verificável', color: 'bg-green-500' },
  { key: 'biasFraming', label: 'Viés / Framing', color: 'bg-amber-500' },
  { key: 'manipulationRisk', label: 'Risco de manipulação', color: 'bg-orange-500' },
]

export default function ResultContent({ analysis }: ResultContentProps) {
  const scores = analysis.scores || {}

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="text-xl font-semibold mb-1 dark:text-white">
        {analysis.verdict || 'Resultado'}
      </h1>
      <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">
        {analysis.input_type} — {new Date(analysis.created_at).toLocaleString('pt-BR')}
      </p>

      {/* Score bars */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 p-6 mb-6">
        <div className="space-y-3">
          {scoreKeys.map(({ key, label, color }) => {
            const value = scores[key] || 0
            return (
              <div key={key}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="dark:text-slate-300">{label}</span>
                  <span className="font-semibold">{value}%</span>
                </div>
                <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full score-bar-fill ${color}`} style={{ width: `${value}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Claims */}
      {analysis.claims && analysis.claims.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold mb-3 dark:text-white">Afirmações analisadas</h2>
          <div className="space-y-2">
            {analysis.claims.map((c: any, i: number) => (
              <div key={i} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-xs">
                <p className="font-medium dark:text-white">{c.claim}</p>
                <p className="text-slate-500 dark:text-slate-400 mt-1">{c.assessment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full report markdown */}
      {analysis.report_markdown && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 p-6">
          <h2 className="text-sm font-semibold mb-4 dark:text-white">Relatório completo</h2>
          <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:text-slate-800 dark:prose-headings:text-white prose-a:text-brand-600 dark:prose-a:text-brand-400 prose-table:text-sm prose-th:bg-slate-100 dark:prose-th:bg-slate-800 prose-th:px-3 prose-th:py-1.5 prose-td:px-3 prose-td:py-1.5">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {analysis.report_markdown}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  )
}
