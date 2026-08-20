import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink, Clock } from 'lucide-react'
import { Badge } from '../ui/Badge'
import type { Analysis } from '../../types'

interface AnalysisCardProps {
  analysis: Analysis
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function AnalysisCard({ analysis }: AnalysisCardProps) {
  const statusVariant = useMemo(() => {
    switch (analysis.status) {
      case 'COMPLETED': return 'success' as const
      case 'PROCESSING': return 'info' as const
      case 'FAILED': return 'error' as const
      default: return 'default' as const
    }
  }, [analysis.status])

  const timeAgo = useMemo(() => formatTimeAgo(analysis.createdAt), [analysis.createdAt])

  return (
    <Link
      to={`/analyze?url=${encodeURIComponent(analysis.url)}`}
      className="block group"
    >
      <div className="p-5 rounded-xl bg-surface border border-border hover:border-primary/20 hover:shadow-lg transition-all duration-200">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-text-primary group-hover:text-primary transition-colors truncate flex-1 mr-2">
            {analysis.title || analysis.url}
          </h3>
          <Badge variant={statusVariant}>{analysis.status}</Badge>
        </div>
        <p className="text-sm text-text-secondary truncate mb-3 flex items-center gap-1">
          <ExternalLink className="w-3 h-3 shrink-0" />
          {analysis.url}
        </p>
        <div className="flex items-center gap-1 text-xs text-text-secondary">
          <Clock className="w-3 h-3" />
          {timeAgo}
        </div>
      </div>
    </Link>
  )
}
