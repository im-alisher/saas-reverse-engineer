export interface Analysis {
  id: string
  url: string
  title?: string | null
  status: AnalysisStatus
  productSummary?: ProductSummary | null
  businessDescription?: string | null
  targetAudience?: string | null
  coreFeatures?: CoreFeatures | null
  userWorkflows?: string[] | null
  valuePropositions?: string[] | null
  competitors?: Competitor[] | null
  marketPositioning?: string | null
  strengths?: string[] | null
  weaknesses?: string[] | null
  revenueModel?: RevenueModel | null
  pricingAssumptions?: PricingAssumption[] | null
  monetizationOpportunities?: string[] | null
  frontendArchitecture?: ArchitectureRecommendation | null
  backendArchitecture?: ArchitectureRecommendation | null
  infrastructureSuggestions?: string[] | null
  databaseSchema?: DatabaseSchemaOutput | null
  prismaSchemaSuggestions?: string[] | null
  databaseEntities?: DatabaseEntity[] | null
  restEndpoints?: ApiEndpoint[] | null
  requestDtos?: ApiDto[] | null
  responseDtos?: ApiDto[] | null
  developmentPhases?: DevelopmentPhase[] | null
  timeline?: TimelineItem[] | null
  milestones?: Milestone[] | null
  createdAt: string
  updatedAt: string
}

export const AnalysisStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
} as const

export type AnalysisStatus = typeof AnalysisStatus[keyof typeof AnalysisStatus]

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface ProductSummary {
  name: string
  overview: string
  category: string
  tagline: string
}

export interface CoreFeatures {
  features: Feature[]
}

export interface Feature {
  name: string
  description: string
  priority: 'high' | 'medium' | 'low'
}

export interface Competitor {
  name: string
  url: string
  description: string
  strengths: string[]
  weaknesses: string[]
}

export interface RevenueModel {
  model: string
  description: string
  estimatedPrice: string
}

export interface PricingAssumption {
  tier: string
  price: string
  features: string[]
}

export interface ArchitectureRecommendation {
  framework: string
  description: string
  keyComponents: string[]
}

export interface DatabaseSchemaOutput {
  entities: string
  description: string
}

export interface DatabaseEntity {
  name: string
  fields: DatabaseField[]
}

export interface DatabaseField {
  name: string
  type: string
  required: boolean
}

export interface ApiEndpoint {
  method: string
  path: string
  description: string
  requestBody?: string
  responseBody?: string
}

export interface ApiDto {
  name: string
  fields: ApiField[]
}

export interface ApiField {
  name: string
  type: string
  required: boolean
  description?: string
}

export interface DevelopmentPhase {
  name: string
  description: string
  duration: string
  tasks: string[]
}

export interface TimelineItem {
  week: string
  tasks: string[]
}

export interface Milestone {
  name: string
  description: string
  deliverables: string[]
}
