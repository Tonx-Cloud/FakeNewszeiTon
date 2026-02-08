'use client'
import { useDarkMode } from './DarkModeProvider'

interface NavProps {
  variant?: 'hero' | 'standard'
}

export default function Nav({ variant = 'standard' }: NavProps) {
  const { dark, toggle } = useDarkMode()
  const isHero = variant === 'hero'

  const linkClass = isHero
    ? 'text-white/50 hover:text-white'
    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'

  return (
    <nav className={`relative z-10 flex items-center justify-between px-6 py-4 max-w-4xl mx-auto ${
      isHero ? '' : 'border-b border-slate-200/60 dark:border-slate-700/60'
    }`}>
      <a
        href="/"
        className={`text-sm font-medium tracking-wide ${
          isHero
            ? 'text-white/90'
            : 'text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 transition'
        }`}
      >
        Fake <span className="text-[#1d9bf0]">News</span> Verificaton
      </a>

      <div className="flex items-center gap-4">
        {[
          { href: '/alerts', label: 'Alertas' },
          { href: '/subscribe', label: 'Inscrever-se' },
          { href: '/sobre', label: 'Sobre' },
          { href: '/auth', label: 'Entrar' },
        ].map(link => (
          <a
            key={link.href}
            href={link.href}
            className={`text-xs transition ${linkClass}`}
          >
            {link.label}
          </a>
        ))}
        <button
          onClick={toggle}
          className={`text-lg transition ${
            isHero ? 'text-white/40 hover:text-white' : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'
          }`}
          title="Alternar tema"
        >
          {dark ? '\u2600\uFE0F' : '\uD83C\uDF19'}
        </button>
      </div>
    </nav>
  )
}
