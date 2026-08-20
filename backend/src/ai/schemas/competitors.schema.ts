export interface CompetitorsSchema {
  competitors: Array<{
    name: string
    url: string
    description: string
    strengths: string[]
    weaknesses: string[]
  }>
  marketPositioning: string
  strengths: string[]
  weaknesses: string[]
}
