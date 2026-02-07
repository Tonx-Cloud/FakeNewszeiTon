import React from 'react'

type Props = { params: { id: string } }

export default async function ResultPage({ params }: Props) {
  const id = params.id
  // For MVP show placeholder; real page fetches /api/analysis by id
  return (
    <main className="min-h-screen bg-white p-6 text-slate-800">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-xl font-semibold">Relatório — {id}</h1>
        <div className="mt-4 border rounded p-4">
          <p>Carregando relatório... (MVP)</p>
        </div>
      </div>
    </main>
  )
}
