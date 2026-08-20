import { Zap } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-text-primary">SaaS Reverse Engineer</span>
          </div>
          <p className="text-text-secondary text-sm">
            Powered by AI. Analyze any SaaS product in seconds.
          </p>
        </div>
      </div>
    </footer>
  )
}
