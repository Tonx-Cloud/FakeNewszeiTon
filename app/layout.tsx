import './globals.css'
import React from 'react'
import type { Metadata } from 'next'
import { DarkModeProvider } from '@/components/DarkModeProvider'

export const metadata: Metadata = {
  metadataBase: new URL('https://fakenewsverificaton.com.br'),
  title: 'Fake News VerificaTon — Verifique antes de compartilhar',
  description: 'Analise mensagens do WhatsApp e redes sociais para identificar sinais de desinformação, viés ou manipulação. Ferramenta gratuita e independente.',
  openGraph: {
    title: 'Fake News VerificaTon — Verifique antes de compartilhar',
    description: 'Analise conteúdos suspeitos com IA antes de compartilhar. Neutralidade por método.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Fake News VerificaTon',
    url: 'https://fakenewsverificaton.com.br',
  },
  twitter: {
    card: 'summary',
    title: 'Fake News VerificaTon',
    description: 'Análise de desinformação com IA. Verifique antes de compartilhar.',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        <DarkModeProvider>
          {children}
        </DarkModeProvider>
      </body>
    </html>
  )
}
