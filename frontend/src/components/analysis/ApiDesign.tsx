import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Code } from 'lucide-react'
import type { ApiEndpoint, ApiDto } from '../../types'

interface ApiDesignProps {
  endpoints?: ApiEndpoint[] | null
  requestDtos?: ApiDto[] | null
  responseDtos?: ApiDto[] | null
}

export function ApiDesign({ endpoints, requestDtos, responseDtos }: ApiDesignProps) {
  const methodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'success' as const
      case 'POST': return 'info' as const
      case 'PUT': return 'warning' as const
      case 'DELETE': return 'error' as const
      default: return 'default' as const
    }
  }

  return (
    <Card>
      <h3 className="flex items-center gap-2 text-lg font-semibold text-text-primary mb-4">
        <Code className="w-5 h-5" /> API Design
      </h3>

      {endpoints && endpoints.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-text-secondary mb-3">REST Endpoints</h4>
          <div className="space-y-2">
            {endpoints.map((ep, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-background border border-border">
                <Badge variant={methodColor(ep.method)}>{ep.method}</Badge>
                <div className="flex-1">
                  <code className="text-sm text-text-primary font-mono">{ep.path}</code>
                  <p className="text-xs text-text-secondary mt-1">{ep.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(requestDtos && requestDtos.length > 0) || (responseDtos && responseDtos.length > 0) ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requestDtos && requestDtos.map((dto, i) => (
            <div key={i} className="p-3 rounded-lg bg-background border border-border">
              <span className="text-sm font-medium text-primary">{dto.name}</span>
              <div className="mt-2 space-y-1">
                {dto.fields.map((f, j) => (
                  <div key={j} className="text-xs">
                    <span className="text-text-primary">{f.name}</span>
                    <span className="text-text-secondary">: {f.type}</span>
                    {!f.required && <span className="text-warning ml-1">optional</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
          {responseDtos && responseDtos.map((dto, i) => (
            <div key={i} className="p-3 rounded-lg bg-background border border-border">
              <span className="text-sm font-medium text-success">{dto.name}</span>
              <div className="mt-2 space-y-1">
                {dto.fields.map((f, j) => (
                  <div key={j} className="text-xs">
                    <span className="text-text-primary">{f.name}</span>
                    <span className="text-text-secondary">: {f.type}</span>
                    {!f.required && <span className="text-warning ml-1">optional</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </Card>
  )
}
