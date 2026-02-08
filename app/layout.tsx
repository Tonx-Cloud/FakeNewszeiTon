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
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'Fake News VerificaTon — Verifique antes de compartilhar',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fake News VerificaTon — Verifique antes de compartilhar',
    description: 'Análise de desinformação com IA. Gratuito e apartidário.',
    images: ['/api/og'],
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
