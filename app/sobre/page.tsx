import React from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sobre Nos — Fake News Verificaton',
  description: 'Conheca a missao, metodologia e compromisso de neutralidade do Fake News Verificaton.',
}

export default function SobrePage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors">
      <Nav />

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold dark:text-white mb-3">
            Sobre o Fake <span className="text-[#1d9bf0]">News</span> Verificaton
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            Uma ferramenta independente e gratuita para ajudar brasileiros a identificar desinformacao antes de compartilhar.
          </p>
        </div>

        {/* Mission */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-3 dark:text-white flex items-center gap-2">
            <span className="text-2xl">🎯</span> Nossa Missao
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
            O Fake News Verificaton nasceu da necessidade de combater a disseminacao de informacoes falsas no Brasil.
            Em tempos de sobrecarga informacional, onde mensagens virais no WhatsApp e redes sociais podem causar danos reais
            a pessoas e instituicoes, oferecemos uma ferramenta acessivel para que qualquer cidadao possa verificar a
            confiabilidade de um conteudo antes de compartilha-lo.
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Acreditamos que o acesso a informacao verificada e um direito fundamental e que a tecnologia pode ser uma aliada
            poderosa na defesa da verdade.
          </p>
        </section>

        {/* Methodology */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-3 dark:text-white flex items-center gap-2">
            <span className="text-2xl">🔬</span> Metodologia
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Nossa analise utiliza inteligencia artificial (Gemini AI do Google) combinada com cruzamento de dados de
            agencias de fact-checking reconhecidas. O processo segue etapas rigorosas:
          </p>
          <div className="space-y-3">
            {[
              { step: '1', title: 'Extracao de afirmacoes', desc: 'Identificamos as afirmacoes factuais presentes no conteudo submetido.' },
              { step: '2', title: 'Verificacao cruzada', desc: 'Comparamos com bases de dados de checagens ja realizadas por agencias como Lupa, Aos Fatos e AFP.' },
              { step: '3', title: 'Analise de sinais', desc: 'Avaliamos indicadores de manipulacao: linguagem emocional, ausencia de fontes, inconsistencias logicas e tecnicas de persuasao.' },
              { step: '4', title: 'Scoring multidimensional', desc: 'Geramos pontuacoes em 4 eixos: probabilidade de fake, verificabilidade, vies/framing e risco de manipulacao.' },
              { step: '5', title: 'Relatorio estruturado', desc: 'Entregamos um relatorio completo com veredito, fundamentacao e sugestoes de verificacao adicional.' },
            ].map(item => (
              <div key={item.step} className="flex gap-3">
                <div className="w-8 h-8 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <p className="text-sm font-medium dark:text-white">{item.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Neutrality */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-3 dark:text-white flex items-center gap-2">
            <span className="text-2xl">⚖️</span> Compromisso de Neutralidade
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
            O Fake News Verificaton <strong>nao apoia candidatos, partidos ou ideologias</strong>. Nossa analise e
            guiada estritamente por metodo:
          </p>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-brand-500 mt-0.5">•</span>
              Extraimos as afirmacoes factuais do conteudo
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-500 mt-0.5">•</span>
              Avaliamos a evidencia disponivel de forma objetiva
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-500 mt-0.5">•</span>
              Verificamos consistencia logica e apontamos tecnicas de manipulacao
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-500 mt-0.5">•</span>
              Quando nao ha base suficiente, o resultado e &quot;Inconclusivo&quot;
            </li>
          </ul>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-3">
            Neutralidade por metodo significa que nao temos agenda politica — temos processo analitico.
          </p>
        </section>

        {/* Sources */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-3 dark:text-white flex items-center gap-2">
            <span className="text-2xl">📰</span> Fontes de Referencia
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Recomendamos sempre confirmar resultados em agencias independentes de checagem:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { name: 'Agencia Lupa', url: 'https://lupa.uol.com.br' },
              { name: 'Aos Fatos', url: 'https://aosfatos.org' },
              { name: 'Fato ou Fake (g1)', url: 'https://g1.globo.com/fato-ou-fake' },
              { name: 'Estadao Verifica', url: 'https://politica.estadao.com.br/verificacao' },
              { name: 'AFP Checamos', url: 'https://checar.afp.com' },
              { name: 'Snopes', url: 'https://www.snopes.com' },
            ].map(s => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-300 dark:hover:border-brand-700 transition text-center"
              >
                {s.name}
              </a>
            ))}
          </div>
        </section>

        {/* Limitations */}
        <section className="bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-200/60 dark:border-amber-800/30 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-3 text-amber-800 dark:text-amber-200 flex items-center gap-2">
            <span className="text-2xl">⚠️</span> Limitacoes
          </h2>
          <ul className="space-y-2 text-sm text-amber-700 dark:text-amber-300">
            <li className="flex items-start gap-2">
              <span className="mt-0.5">•</span>
              A analise e assistida por IA e <strong>nao substitui agencias profissionais de checagem</strong>.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5">•</span>
              A IA pode cometer erros, especialmente com conteudos muito recentes ou satiricos.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5">•</span>
              Os resultados devem ser usados como ponto de partida, nao como veredito final.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5">•</span>
              Sempre busque multiplas fontes confiaveis antes de tirar conclusoes.
            </li>
          </ul>
        </section>

        {/* Project info */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 p-6">
          <h2 className="text-lg font-semibold mb-3 dark:text-white flex items-center gap-2">
            <span className="text-2xl">💻</span> Sobre o Projeto
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
            O Fake News Verificaton e um projeto independente e voluntario, desenvolvido com tecnologias modernas:
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Gemini AI', 'Vercel'].map(tech => (
              <span key={tech} className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-medium">
                {tech}
              </span>
            ))}
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            O codigo e aberto e contribuicoes sao bem-vindas. Se voce deseja ajudar a melhorar a ferramenta,
            entre em contato ou visite nosso repositorio.
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <a
              href="https://github.com/Tonx-Cloud/FakeNewszeiTon"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-xl text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-600 transition"
            >
              GitHub
            </a>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-medium hover:bg-brand-700 transition"
            >
              Analisar conteudo
            </a>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}
