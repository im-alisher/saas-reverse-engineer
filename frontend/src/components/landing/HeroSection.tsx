import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ArrowRight } from 'lucide-react'
import { Button } from '../ui/Button'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
      <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            AI-Powered Analysis
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-text-primary tracking-tight mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Reverse Engineer Any
            <span className="text-primary"> SaaS Product</span>
          </h1>
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Enter a SaaS URL and get a comprehensive analysis including features,
            architecture, database schema, and MVP roadmap — all powered by AI.
          </p>
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <UrlInput />
          </div>
        </div>
      </div>
    </section>
  )
}

function UrlInput() {
  const [url, setUrl] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return
    navigate(`/analyze?url=${encodeURIComponent(url.trim())}`)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="relative flex items-center gap-3 flex-col sm:flex-row">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter SaaS URL (e.g., https://notion.so)"
            className="w-full pl-12 pr-4 py-4 rounded-xl bg-surface border border-border text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-base shadow-lg"
            required
          />
        </div>
        <Button type="submit" size="lg" className="gap-2 shrink-0 w-full sm:w-auto">
          Analyze
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </form>
  )
}
