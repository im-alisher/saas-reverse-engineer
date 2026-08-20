import { Card } from '../ui/Card'
import { DollarSign, Lightbulb } from 'lucide-react'
import type { RevenueModel as RevenueModelType, PricingAssumption } from '../../types'

interface RevenueModelProps {
  revenue?: RevenueModelType | null
  pricingAssumptions?: PricingAssumption[] | null
  monetizationOpportunities?: string[] | null
}

export function RevenueModel({ revenue, pricingAssumptions, monetizationOpportunities }: RevenueModelProps) {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-text-primary mb-4">Revenue Model</h3>

      {revenue && (
        <div className="mb-6 p-4 rounded-lg bg-primary/5 border border-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-primary" />
            <span className="font-medium text-primary">{revenue.model}</span>
          </div>
          <p className="text-sm text-text-primary mb-1">{revenue.description}</p>
          <p className="text-sm font-medium text-text-secondary">Estimated: {revenue.estimatedPrice}</p>
        </div>
      )}

      {pricingAssumptions && pricingAssumptions.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-text-secondary mb-3">Pricing Tiers</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pricingAssumptions.map((tier, i) => (
              <div key={i} className="p-3 rounded-lg bg-background border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-text-primary">{tier.tier}</span>
                  <span className="text-sm font-bold text-primary">{tier.price}</span>
                </div>
                <ul className="space-y-1">
                  {tier.features.map((f, j) => (
                    <li key={j} className="text-xs text-text-secondary">• {f}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {monetizationOpportunities && monetizationOpportunities.length > 0 && (
        <div>
          <h4 className="flex items-center gap-2 text-sm font-medium text-text-secondary mb-3">
            <Lightbulb className="w-4 h-4" /> Monetization Opportunities
          </h4>
          <ul className="space-y-2">
            {monetizationOpportunities.map((opp, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-text-primary">
                <span className="text-primary">→</span> {opp}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  )
}
