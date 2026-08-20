-- CreateEnum
CREATE TYPE "AnalysisStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "Analysis" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT,
    "status" "AnalysisStatus" NOT NULL DEFAULT 'PENDING',
    "productSummary" JSONB,
    "businessDescription" TEXT,
    "targetAudience" TEXT,
    "coreFeatures" JSONB,
    "userWorkflows" JSONB,
    "valuePropositions" JSONB,
    "competitors" JSONB,
    "marketPositioning" TEXT,
    "strengths" JSONB,
    "weaknesses" JSONB,
    "revenueModel" JSONB,
    "pricingAssumptions" JSONB,
    "monetizationOpportunities" JSONB,
    "frontendArchitecture" JSONB,
    "backendArchitecture" JSONB,
    "infrastructureSuggestions" JSONB,
    "databaseSchema" JSONB,
    "prismaSchemaSuggestions" JSONB,
    "databaseEntities" JSONB,
    "restEndpoints" JSONB,
    "requestDtos" JSONB,
    "responseDtos" JSONB,
    "developmentPhases" JSONB,
    "timeline" JSONB,
    "milestones" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Analysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Analysis_createdAt_idx" ON "Analysis"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "Analysis_status_idx" ON "Analysis"("status");
