'use client'
import { useState, useMemo } from 'react'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

function useSupabase(): SupabaseClient | null {
  return useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) return null
    return createClient(url, key)
  }, [])
}

export default function AuthPage() {
  const supabase = useSupabase()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !supabase) {
      setError('Configuracao Supabase indisponivel.')
      return
    }
    setLoading(true)
    setError('')

    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/auth/callback`,
      }
    })

    if (authError) {
      setError(authError.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  if (sent) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors">
        <Nav />
        <div className="max-w-md mx-auto text-center px-6 pt-16 pb-16">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold mb-2 dark:text-white">Verifique seu email</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Enviamos um link magico para <strong className="dark:text-slate-200">{email}</strong>.
            <br />Clique no link para entrar.
          </p>
          <button
            onClick={() => { setSent(false); setEmail('') }}
            className="mt-6 text-sm text-slate-400 hover:text-brand-500 transition"
          >
            Tentar outro email
          </button>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors">
      <Nav />

      <div className="max-w-md mx-auto px-6 pt-12 pb-16">
        <h1 className="text-xl font-semibold mb-2 dark:text-white">Entrar no Fake News Verificaton</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Use seu email para receber um link magico de acesso. Sem senha necessaria.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 p-6">
            <label htmlFor="email" className="text-sm font-medium block mb-1.5 dark:text-slate-200">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 dark:text-white placeholder-slate-400"
              required
            />
          </div>

          {error && (
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl animate-fade-in">
              <p className="text-xs text-amber-700 dark:text-amber-300">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="w-full bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-700 hover:to-purple-700 text-white py-3.5 rounded-2xl font-semibold text-base shadow-lg shadow-brand-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? 'Enviando...' : 'Enviar link magico'}
          </button>
        </form>

        <p className="text-xs text-slate-400 dark:text-slate-500 mt-6 text-center">
          Ao entrar, voce pode salvar historico de analises e receber alertas de fakes em alta.
        </p>
      </div>

      <Footer />
    </main>
  )
}
