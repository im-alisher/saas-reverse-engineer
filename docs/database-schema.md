# Database Schema

## Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Analysis {
  id            String   @id @default(cuid())
  url           String
  title         String?
  status        AnalysisStatus @default(PENDING)

  // Product Summary
  productSummary Json?
  businessDescription String?
  targetAudience String?

  // Core Features
  coreFeatures  Json?
  userWorkflows Json?
  valuePropositions Json?

  // Competitor Analysis
  competitors   Json?
  marketPositioning String?
  strengths     Json?
  weaknesses    Json?

  // Revenue Model
  revenueModel  Json?
  pricingAssumptions Json?
  monetizationOpportunities Json?

  // Architecture
  frontendArchitecture Json?
  backendArchitecture Json?
  infrastructureSuggestions Json?

  // Database Schema
  databaseSchema Json?
  prismaSchemaSuggestions Json?
  databaseEntities Json?

  // API Design
  restEndpoints Json?
  requestDtos   Json?
  responseDtos  Json?

  // MVP Roadmap
  developmentPhases Json?
  timeline      Json?
  milestones    Json?

  // Metadata
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([createdAt(sort: Desc)])
  @@index([status])
}

enum AnalysisStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
}
```

## Entity Relationships

- Single `Analysis` model (no complex relationships needed for MVP)
- All AI-generated data stored as JSON for flexibility
- Status enum tracks analysis lifecycle
- Indexed on `createdAt` for efficient dashboard queries
- Indexed on `status` for filtering

## Migration Strategy

- Use Prisma Migrate for schema management
- JSON fields allow flexible AI output without schema changes
- Consider relational tables in v2 if querying specific fields becomes necessary
