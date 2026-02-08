'use client'
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

interface DarkModeContextType {
  dark: boolean
  toggle: () => void
}

const DarkModeContext = createContext<DarkModeContextType>({ dark: false, toggle: () => {} })

export function useDarkMode() {
  return useContext(DarkModeContext)
}

export function DarkModeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDark(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggle = useCallback(() => {
    setDark(d => {
      const next = !d
      document.documentElement.classList.toggle('dark', next)
      localStorage.setItem('theme', next ? 'dark' : 'light')
      return next
    })
  }, [])

  return (
    <DarkModeContext.Provider value={{ dark, toggle }}>
      {children}
    </DarkModeContext.Provider>
  )
}
