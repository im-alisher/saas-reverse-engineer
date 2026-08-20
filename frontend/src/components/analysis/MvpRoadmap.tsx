import { Card } from '../ui/Card'
import { Map, CheckCircle } from 'lucide-react'
import type { DevelopmentPhase, TimelineItem, Milestone } from '../../types'

interface MvpRoadmapProps {
  phases?: DevelopmentPhase[] | null
  timeline?: TimelineItem[] | null
  milestones?: Milestone[] | null
}

export function MvpRoadmap({ phases, milestones }: MvpRoadmapProps) {
  return (
    <Card>
      <h3 className="flex items-center gap-2 text-lg font-semibold text-text-primary mb-4">
        <Map className="w-5 h-5" /> MVP Roadmap
      </h3>

      {phases && phases.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-text-secondary mb-3">Development Phases</h4>
          <div className="space-y-3">
            {phases.map((phase, i) => (
              <div key={i} className="p-4 rounded-lg bg-background border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-text-primary">{phase.name}</span>
                  <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">{phase.duration}</span>
                </div>
                <p className="text-xs text-text-secondary mb-2">{phase.description}</p>
                <ul className="space-y-1">
                  {phase.tasks.map((task, j) => (
                    <li key={j} className="text-xs text-text-secondary flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {milestones && milestones.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-text-secondary mb-3">Milestones</h4>
          <div className="space-y-3">
            {milestones.map((ms, i) => (
              <div key={i} className="p-3 rounded-lg bg-success/5 border border-success/10">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="font-medium text-text-primary">{ms.name}</span>
                </div>
                <p className="text-xs text-text-secondary mb-2">{ms.description}</p>
                <div className="flex flex-wrap gap-1">
                  {ms.deliverables.map((d, j) => (
                    <span key={j} className="text-xs bg-surface px-2 py-0.5 rounded border border-border">{d}</span>
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
