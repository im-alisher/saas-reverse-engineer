import { Card } from '../ui/Card'
import type { ProductSummary as ProductSummaryType } from '../../types'

interface ProductSummaryProps {
  data: ProductSummaryType | null
  businessDescription?: string | null
  targetAudience?: string | null
}

export function ProductSummary({ data, businessDescription, targetAudience }: ProductSummaryProps) {
  if (!data) return null

  return (
    <Card>
      <h3 className="text-lg font-semibold text-text-primary mb-4">Product Summary</h3>
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-text-secondary mb-1">Overview</h4>
          <p className="text-text-primary">{data.overview}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-text-secondary mb-1">Category</h4>
            <p className="text-text-primary">{data.category}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-text-secondary mb-1">Tagline</h4>
            <p className="text-text-primary italic">{data.tagline}</p>
          </div>
        </div>
        {businessDescription && (
          <div>
            <h4 className="text-sm font-medium text-text-secondary mb-1">Business Description</h4>
            <p className="text-text-primary text-sm leading-relaxed">{businessDescription}</p>
          </div>
        )}
        {targetAudience && (
          <div>
            <h4 className="text-sm font-medium text-text-secondary mb-1">Target Audience</h4>
            <p className="text-text-primary text-sm leading-relaxed">{targetAudience}</p>
          </div>
        )}
      </div>
    </Card>
  )
}
