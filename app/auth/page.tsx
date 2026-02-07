import React from 'react'

export default function AuthPage() {
  return (
    <main className="min-h-screen bg-white p-6 text-slate-800">
      <div className="max-w-md mx-auto">
        <h1 className="text-xl font-semibold">Entrar / Registrar</h1>
        <p className="text-sm text-slate-500 mt-2">Usamos Supabase Auth. (Magic link ou email+senha)</p>
      </div>
    </main>
  )
}
