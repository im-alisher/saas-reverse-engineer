export interface FeaturesSchema {
  coreFeatures: {
    features: Array<{
      name: string
      description: string
      priority: 'high' | 'medium' | 'low'
    }>
  }
  userWorkflows: string[]
  valuePropositions: string[]
}
