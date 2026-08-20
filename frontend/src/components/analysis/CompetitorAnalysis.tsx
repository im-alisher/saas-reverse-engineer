import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { ExternalLink, TrendingUp, TrendingDown } from 'lucide-react'
import type { Competitor } from '../../types'

interface CompetitorAnalysisProps {
  competitors?: Competitor[] | null
  marketPositioning?: string | null
  strengths?: string[] | null
  weaknesses?: string[] | null
}

export function CompetitorAnalysis({ competitors, marketPositioning, strengths, weaknesses }: CompetitorAnalysisProps) {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-text-primary mb-4">Competitor Analysis</h3>

      {marketPositioning && (
        <div className="mb-6 p-4 rounded-lg bg-primary/5 border border-primary/10">
          <h4 className="text-sm font-medium text-primary mb-2">Market Positioning</h4>
          <p className="text-sm text-text-primary">{marketPositioning}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {strengths && strengths.length > 0 && (
          <div className="p-4 rounded-lg bg-success/5 border border-success/10">
            <h4 className="flex items-center gap-2 text-sm font-medium text-success mb-3">
              <TrendingUp className="w-4 h-4" /> Strengths
            </h4>
            <ul className="space-y-1">
              {strengths.map((s, i) => (
                <li key={i} className="text-sm text-text-primary">• {s}</li>
              ))}
            </ul>
          </div>
        )}
        {weaknesses && weaknesses.length > 0 && (
          <div className="p-4 rounded-lg bg-error/5 border border-error/10">
            <h4 className="flex items-center gap-2 text-sm font-medium text-error mb-3">
              <TrendingDown className="w-4 h-4" /> Weaknesses
            </h4>
            <ul className="space-y-1">
              {weaknesses.map((w, i) => (
                <li key={i} className="text-sm text-text-primary">• {w}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {competitors && competitors.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-text-secondary mb-3">Competitors</h4>
          <div className="space-y-3">
            {competitors.map((comp, i) => (
              <div key={i} className="p-3 rounded-lg bg-background border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-text-primary">{comp.name}</span>
                  {comp.url && (
                    <a href={comp.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-hover">
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <p className="text-xs text-text-secondary mb-2">{comp.description}</p>
                <div className="flex flex-wrap gap-1">
                  {comp.strengths.slice(0, 3).map((s, j) => (
                    <Badge key={j} variant="success">+ {s}</Badge>
                  ))}
                  {comp.weaknesses.slice(0, 2).map((w, j) => (
                    <Badge key={j} variant="error">- {w}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}
