import React from 'react'
import { createSupabaseServerClient } from '../../lib/supabaseAuth'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const dynamic = 'force-dynamic'

export default async function AlertsPage() {
  const supabase = createSupabaseServerClient()

  // Get current user session
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch top trending items (public, no auth required)
  const { data: trending } = await supabase
    .from('trending_items')
    .select('*')
    .order('score_fake_probability', { ascending: false })
    .limit(20)

  // If logged in, get profile for notification preferences
  let profile: any = null
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
    profile = data
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors">
      <Nav />

      <div className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="text-xl font-semibold mb-6 dark:text-white">Fakes em Alta</h1>

        {/* Trending list */}
        {(!trending || trending.length === 0) ? (
          <div className="text-center py-12">
            <p className="text-slate-400 dark:text-slate-500 text-sm">Nenhum item em alta ainda.</p>
            <p className="text-slate-300 dark:text-slate-600 text-xs mt-2">Faça uma análise na página inicial para começar a popular esta lista.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {trending.map((item: any, i: number) => (
              <div key={item.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium dark:text-white">
                      <span className="text-slate-400 dark:text-slate-500 mr-2">#{i + 1}</span>
                      {item.title}
                    </h3>
                    {item.reason && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.reason}</p>
                    )}
                  </div>
                  <div className="ml-4 text-right">
                    <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
                      (item.score_fake_probability || 0) >= 70 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      (item.score_fake_probability || 0) >= 40 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    }`}>
                      {item.score_fake_probability || 0}% fake
                    </span>
                  </div>
                </div>
                <div className="flex gap-4 mt-2 text-xs text-slate-400 dark:text-slate-500">
                  <span>Visto {item.occurrences || 1}x</span>
                  {item.last_seen && (
                    <span>Último: {new Date(item.last_seen).toLocaleDateString('pt-BR')}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Auth / notification section */}
        <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-6">
          {!user ? (
            <div className="text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                Entre para receber alertas por email quando novos fakes surgirem.
              </p>
              <a
                href="/auth"
                className="inline-block bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition"
              >
                Entrar com email
              </a>
            </div>
          ) : (
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                Logado como <strong>{user.email}</strong>
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Notificações por email: {profile?.notify_enabled ? 'Ativadas' : 'Desativadas'}
                {profile?.notify_enabled && ` (${profile?.notify_frequency || 'daily'})`}
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
