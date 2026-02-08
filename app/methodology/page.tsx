import React from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Metodologia — Fake News VerificaTon',
  description: 'Como o Fake News VerificaTon analisa conteúdos e identifica sinais de desinformação.',
}

const steps = [
  {
    icon: '📥',
    title: '1. Recebimento do conteúdo',
    desc: 'O usuário submete um texto, link (URL ou YouTube), imagem ou áudio. O sistema identifica o tipo de entrada e extrai o conteúdo de forma automatizada.',
    details: [
      'URLs: extração via Readability (jsdom + @mozilla/readability) para obter o texto principal, descartando propagandas e menus.',
      'YouTube: extração automática das legendas/transcrições do vídeo.',
      'Textos: análise direta do conteúdo submetido.',
      'Imagens e áudio: processamento multimodal pela IA.',
    ],
  },
  {
    icon: '🧹',
    title: '2. Sanitização e validação',
    desc: 'O conteúdo extraído é sanitizado para remover scripts, tags HTML residuais e normalizar espaçamentos. Validações de segurança são aplicadas antes do processamento.',
    details: [
      'Remoção de tags HTML, entidades e potenciais payloads de injeção.',
      'Limite de tamanho (~4.5 MB) para prevenir abuso.',
      'Verificação anti-bot (Cloudflare Turnstile) e rate limiting (Upstash).',
    ],
  },
  {
    icon: '🤖',
    title: '3. Análise por IA (Gemini)',
    desc: 'O conteúdo limpo é enviado ao modelo Gemini 2.0 Flash com um prompt estruturado que solicita análise objetiva e baseada em evidências.',
    details: [
      'O prompt instrui a IA a avaliar: precisão factual, presença de viés, manipulação emocional, omissão de contexto, fontes e coerência.',
      'A IA não opina politicamente — avalia apenas a consistência das afirmações com fatos verificáveis.',
      'Quando citam-se pessoas públicas, a IA verifica se as afirmações atribuídas a elas podem ser corroboradas por registros oficiais.',
      'Resultado: veredito (Verdadeiro, Parcialmente verdadeiro, Enganoso, Falso, Inconclusivo), score de confiança, justificativa detalhada e sugestão de fontes.',
    ],
  },
  {
    icon: '🔍',
    title: '4. Verificação de canais oficiais de figuras públicas',
    desc: 'Quando o conteúdo envolve declarações atribuídas a personalidades, políticos ou instituições, o sistema orienta a verificação nos canais oficiais.',
    details: [
      'Perfis verificados em redes sociais (selo azul/oficial) do autor citado.',
      'Sites oficiais de órgãos governamentais, partidos ou instituições.',
      'Comunicados à imprensa e pronunciamentos oficiais publicados.',
      'Diários oficiais, bases de dados públicas e registros legislativos.',
      'Esta etapa reforça a análise e protege contra citações fabricadas ou fora de contexto.',
    ],
  },
  {
    icon: '📊',
    title: '5. Estruturação do relatório',
    desc: 'O relatório é formatado com seções claras: resumo, veredito, confiança, justificativa, fontes e dicas de verificação.',
    details: [
      'Linguagem acessível para qualquer público.',
      'Destaque visual para o veredito e nível de confiança.',
      'Links para fontes recomendadas de verificação adicional.',
      'Sugestões práticas de como o usuário pode verificar por conta própria.',
    ],
  },
  {
    icon: '📈',
    title: '6. Agregação de tendências',
    desc: 'Após a análise, o resumo é agregado anonimamente para identificar padrões e tendências de desinformação em alta.',
    details: [
      'Dados pessoais do usuário não são vinculados à análise.',
      'O painel de "Fakes em alta" mostra os temas mais recorrentes.',
      'Inscritos recebem alertas sobre novas tendências identificadas.',
    ],
  },
]

export default function MethodologyPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors">
      <Nav />

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold dark:text-white mb-3">Metodologia</h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Como o Fake News VerificaTon analisa conteúdos e identifica sinais de desinformação, viés e manipulação.
          </p>
        </div>

        {/* Principles banner */}
        <div className="bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-brand-800 dark:text-brand-200 mb-3">Princípios fundamentais</h2>
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-xl">⚖️</span>
              <div>
                <strong className="text-brand-700 dark:text-brand-300">Neutralidade</strong>
                <p className="text-brand-600 dark:text-brand-400 text-xs mt-0.5">Apartidário. Sem viés ideológico. Avaliam-se fatos, não opiniões.</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-xl">🔬</span>
              <div>
                <strong className="text-brand-700 dark:text-brand-300">Transparência</strong>
                <p className="text-brand-600 dark:text-brand-400 text-xs mt-0.5">Código aberto. Metodologia pública. Limitações declaradas.</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-xl">🛡️</span>
              <div>
                <strong className="text-brand-700 dark:text-brand-300">Privacidade</strong>
                <p className="text-brand-600 dark:text-brand-400 text-xs mt-0.5">LGPD compliant. Double opt-in. Dados mínimos.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-6">
          {steps.map((step, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{step.icon}</span>
                <h3 className="text-lg font-semibold dark:text-white">{step.title}</h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">{step.desc}</p>
              <ul className="space-y-1.5">
                {step.details.map((d, j) => (
                  <li key={j} className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Limitations */}
        <div className="mt-10 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-3">⚠️ Limitações</h2>
          <ul className="space-y-2 text-sm text-amber-700 dark:text-amber-300">
            <li>• A análise é <strong>assistida por IA</strong> e não substitui fact-checking profissional.</li>
            <li>• A IA pode errar, alucinar ou não ter acesso a informações recentes.</li>
            <li>• Conteúdo em idiomas diferentes do português pode ter menor precisão.</li>
            <li>• Vídeos sem legendas, imagens sem texto legível e áudios com baixa qualidade podem resultar em análises incompletas.</li>
            <li>• O sistema não verifica autenticidade de mídias (deepfakes de imagem/vídeo).</li>
          </ul>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <a href="/" className="inline-block px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-semibold transition shadow-lg shadow-brand-500/25">
            Verificar uma notícia agora
          </a>
          <p className="text-xs text-slate-400 mt-3">
            Dúvidas sobre a metodologia? <a href="mailto:fakeNewsVerificator@gmail.com" className="text-brand-500 hover:underline">fakeNewsVerificator@gmail.com</a>
          </p>
        </div>
      </div>

      <Footer />
    </main>
  )
}
