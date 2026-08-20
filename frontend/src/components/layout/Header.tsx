import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Zap } from 'lucide-react'
import { ThemeToggle } from '../ui/ThemeToggle'

interface HeaderProps {
  theme: 'light' | 'dark'
  toggleTheme: () => void
  children?: ReactNode
}

export function Header({ theme, toggleTheme, children }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-text-primary hidden sm:block">
              SaaS Reverse Engineer
            </span>
          </Link>
          <div className="flex items-center gap-3">
            {children}
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
        </div>
      </div>
    </header>
  )
}
