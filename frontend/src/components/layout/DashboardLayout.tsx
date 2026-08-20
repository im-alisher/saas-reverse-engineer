import type { ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'

interface DashboardLayoutProps {
  theme: 'light' | 'dark'
  toggleTheme: () => void
  children: ReactNode
}

export function DashboardLayout({ theme, toggleTheme, children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
