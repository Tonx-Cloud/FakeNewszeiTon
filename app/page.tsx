import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-800 p-6">
      <div className="max-w-3xl mx-auto">
        <header className="py-6">
          <h1 className="text-2xl font-semibold">FakeNewsZeiTon</h1>
          <p className="text-sm text-slate-500 mt-2">Análise assistida por IA (OpenAI) para estimar risco de desinformação, viés e sinais de golpe. Não substitui agências de fact-checking.</p>
        </header>

        <section className="mt-6 border rounded p-4">
          <h2 className="font-medium">Enviar conteúdo</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link href="/auth" className="border rounded p-3 text-center">Entrar</Link>
            <Link href="/result/preview" className="border rounded p-3 text-center">Analisar (demo)</Link>
          </div>
        </section>

        <footer className="text-xs text-slate-400 mt-8">Modo: MVP — fontes externas não consultadas por padrão.</footer>
      </div>
    </main>
  )
}
