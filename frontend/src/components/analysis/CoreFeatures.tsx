import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import type { CoreFeatures as CoreFeaturesType } from '../../types'
import { CheckCircle } from 'lucide-react'

interface CoreFeaturesProps {
  features: CoreFeaturesType | null
  userWorkflows?: string[] | null
  valuePropositions?: string[] | null
}

export function CoreFeatures({ features, userWorkflows, valuePropositions }: CoreFeaturesProps) {
  if (!features?.features?.length) return null

  const priorityVariant = (p: string) => {
    if (p === 'high') return 'error' as const
    if (p === 'medium') return 'warning' as const
    return 'default' as const
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold text-text-primary mb-4">Core Features</h3>
      <div className="space-y-3 mb-6">
        {features.features.map((feature, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-background">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-text-primary">{feature.name}</span>
                <Badge variant={priorityVariant(feature.priority)}>{feature.priority}</Badge>
              </div>
              <p className="text-sm text-text-secondary">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      {valuePropositions && valuePropositions.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-text-secondary mb-3">Value Propositions</h4>
          <div className="space-y-2">
            {valuePropositions.map((vp, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success shrink-0" />
                <span className="text-sm text-text-primary">{vp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {userWorkflows && userWorkflows.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-text-secondary mb-3">User Workflows</h4>
          <div className="space-y-2">
            {userWorkflows.map((workflow, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-xs font-medium text-primary bg-primary/10 rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm text-text-primary">{workflow}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}
