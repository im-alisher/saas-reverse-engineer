export interface RevenueModelSchema {
  revenueModel: { model: string; description: string; estimatedPrice: string }
  pricingAssumptions: Array<{ tier: string; price: string; features: string[] }>
  monetizationOpportunities: string[]
}
