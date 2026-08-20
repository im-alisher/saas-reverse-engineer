export interface MvpRoadmapSchema {
  developmentPhases: Array<{ name: string; description: string; duration: string; tasks: string[] }>
  timeline: Array<{ week: string; tasks: string[] }>
  milestones: Array<{ name: string; description: string; deliverables: string[] }>
}
