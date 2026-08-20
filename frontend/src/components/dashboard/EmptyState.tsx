import { useNavigate } from 'react-router-dom'
import { Search, Zap } from 'lucide-react'
import { Button } from '../ui/Button'

export function EmptyState() {
  const navigate = useNavigate()

  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
        <Zap className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-text-primary mb-2">No analyses yet</h3>
      <p className="text-text-secondary mb-6 max-w-md mx-auto">
        Enter a SaaS URL on the home page to get started with your first analysis.
      </p>
      <Button onClick={() => navigate('/')} className="gap-2">
        <Search className="w-4 h-4" />
        Analyze a SaaS
      </Button>
    </div>
  )
}
