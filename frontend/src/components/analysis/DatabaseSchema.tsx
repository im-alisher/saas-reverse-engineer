import { Card } from '../ui/Card'
import { Database } from 'lucide-react'
import type { DatabaseSchemaOutput, DatabaseEntity } from '../../types'

interface DatabaseSchemaProps {
  schema?: DatabaseSchemaOutput | null
  suggestions?: string[] | null
  entities?: DatabaseEntity[] | null
}

export function DatabaseSchema({ schema, suggestions, entities }: DatabaseSchemaProps) {
  return (
    <Card>
      <h3 className="flex items-center gap-2 text-lg font-semibold text-text-primary mb-4">
        <Database className="w-5 h-5" /> Database Schema
      </h3>

      {schema && (
        <div className="mb-6">
          <p className="text-sm text-text-secondary mb-3">{schema.description}</p>
          <pre className="p-4 rounded-lg bg-background border border-border overflow-x-auto text-xs text-text-primary font-mono">
            {schema.entities}
          </pre>
        </div>
      )}

      {entities && entities.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-text-secondary mb-3">Entities</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {entities.map((entity, i) => (
              <div key={i} className="p-3 rounded-lg bg-background border border-border">
                <span className="font-medium text-primary text-sm">{entity.name}</span>
                <div className="mt-2 space-y-1">
                  {entity.fields.map((field, j) => (
                    <div key={j} className="flex items-center gap-2 text-xs">
                      <span className="text-text-primary">{field.name}</span>
                      <span className="text-text-secondary">{field.type}</span>
                      {!field.required && <span className="text-warning">optional</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {suggestions && suggestions.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-text-secondary mb-3">Suggestions</h4>
          <ul className="space-y-2">
            {suggestions.map((s, i) => (
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
