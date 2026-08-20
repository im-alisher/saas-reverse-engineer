import { Card } from '../ui/Card'
import { Monitor, Server, Cloud } from 'lucide-react'
import type { ArchitectureRecommendation } from '../../types'

interface ArchitectureViewProps {
  frontend?: ArchitectureRecommendation | null
  backend?: ArchitectureRecommendation | null
  infrastructure?: string[] | null
}

export function ArchitectureView({ frontend, backend, infrastructure }: ArchitectureViewProps) {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-text-primary mb-4">Architecture Recommendations</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {frontend && (
          <div className="p-4 rounded-lg bg-background border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Monitor className="w-5 h-5 text-primary" />
              <span className="font-medium text-text-primary">Frontend</span>
            </div>
            <p className="text-sm font-medium text-primary mb-1">{frontend.framework}</p>
            <p className="text-xs text-text-secondary mb-3">{frontend.description}</p>
            <ul className="space-y-1">
              {frontend.keyComponents.map((c, i) => (
                <li key={i} className="text-xs text-text-secondary">• {c}</li>
              ))}
            </ul>
          </div>
        )}
        {backend && (
          <div className="p-4 rounded-lg bg-background border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Server className="w-5 h-5 text-primary" />
              <span className="font-medium text-text-primary">Backend</span>
            </div>
            <p className="text-sm font-medium text-primary mb-1">{backend.framework}</p>
            <p className="text-xs text-text-secondary mb-3">{backend.description}</p>
            <ul className="space-y-1">
              {backend.keyComponents.map((c, i) => (
                <li key={i} className="text-xs text-text-secondary">• {c}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {infrastructure && infrastructure.length > 0 && (
        <div>
          <h4 className="flex items-center gap-2 text-sm font-medium text-text-secondary mb-3">
            <Cloud className="w-4 h-4" /> Infrastructure
          </h4>
          <ul className="space-y-2">
            {infrastructure.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-text-primary">
                <span className="text-primary">→</span> {s}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  )
}
