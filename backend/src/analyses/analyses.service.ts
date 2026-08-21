import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { FetchService } from '../fetch/fetch.service'
import { AiService } from '../ai/ai.service'
import { CreateAnalysisDto } from './dto/create-analysis.dto'
import { AnalysisStatus, Prisma } from '@prisma/client'
import { PRODUCT_SUMMARY_PROMPT } from '../ai/prompts/product-summary.prompt'
import { FEATURES_PROMPT } from '../ai/prompts/features.prompt'
import { COMPETITORS_PROMPT } from '../ai/prompts/competitors.prompt'
import { REVENUE_MODEL_PROMPT } from '../ai/prompts/revenue-model.prompt'
import { ARCHITECTURE_PROMPT } from '../ai/prompts/architecture.prompt'
import { DATABASE_PROMPT } from '../ai/prompts/database.prompt'
import { API_DESIGN_PROMPT } from '../ai/prompts/api-design.prompt'
import { MVP_ROADMAP_PROMPT } from '../ai/prompts/mvp-roadmap.prompt'
import type { ProductSummarySchema } from '../ai/schemas/product-summary.schema'
import type { FeaturesSchema } from '../ai/schemas/features.schema'
import type { CompetitorsSchema } from '../ai/schemas/competitors.schema'
import type { RevenueModelSchema } from '../ai/schemas/revenue-model.schema'
import type { ArchitectureSchema } from '../ai/schemas/architecture.schema'
import type { DatabaseSchemaGen } from '../ai/schemas/database.schema'
import type { ApiDesignSchema } from '../ai/schemas/api-design.schema'
import type { MvpRoadmapSchema } from '../ai/schemas/mvp-roadmap.schema'

@Injectable()
export class AnalysesService {
  private readonly logger = new Logger(AnalysesService.name)

  constructor(
    private prisma: PrismaService,
    private fetchService: FetchService,
    private aiService: AiService,
  ) {}

  async create(dto: CreateAnalysisDto) {
    const analysis = await this.prisma.analysis.create({
      data: {
        url: dto.url,
        status: AnalysisStatus.PENDING,
      },
      select: {
        id: true,
        url: true,
        status: true,
        createdAt: true,
      },
    })

    this.processAnalysis(analysis.id, dto.url).catch((error) => {
      this.logger.error(`Analysis ${analysis.id} failed`, error)
    })

    return analysis
  }

  private async delay(ms: number) {
    return new Promise(r => setTimeout(r, ms))
  }

  private async updateWithRetry(id: string, data: Prisma.AnalysisUpdateInput, attempts = 3) {
    for (let attempt = 1; attempt <= attempts; attempt++) {
      try {
        return await this.prisma.analysis.update({ where: { id }, data })
      } catch (error) {
        if (attempt === attempts) throw error
        this.logger.warn(`DB update failed for ${id} (attempt ${attempt}/${attempts}), retrying: ${(error as Error).message}`)
        await this.delay(3000 * attempt)
      }
    }
  }

  private async runStep<T>(
    id: string,
    systemPrompt: string,
    userPrompt: string,
    map: (result: T) => Prisma.AnalysisUpdateInput,
  ) {
    const result = await this.aiService.generateStructuredResponse<T>(systemPrompt, userPrompt)
    await this.updateWithRetry(id, map(result))
  }

  private async processAnalysis(id: string, url: string) {
    await this.updateWithRetry(id, { status: AnalysisStatus.PROCESSING })

    try {
      const content = await this.fetchService.fetchContent(url)

      const userPrompt = `Analyze this SaaS product:
URL: ${url}
Title: ${content.title}
Description: ${content.description}
Content: ${content.content.substring(0, 5000)}`

      const steps: Promise<void>[] = [
        this.runStep<ProductSummarySchema>(
          id,
          PRODUCT_SUMMARY_PROMPT,
          userPrompt,
          r => ({
            title: r.productSummary?.name || content.title,
            productSummary: r.productSummary || null,
            businessDescription: r.businessDescription || content.description,
            targetAudience: r.targetAudience || null,
          }),
        ),
        this.runStep<FeaturesSchema>(
          id,
          FEATURES_PROMPT,
          userPrompt,
          r => ({
            coreFeatures: r.coreFeatures || null,
            userWorkflows: r.userWorkflows || null,
            valuePropositions: r.valuePropositions || null,
          }),
        ),
        this.runStep<CompetitorsSchema>(
          id,
          COMPETITORS_PROMPT,
          userPrompt,
          r => ({
            competitors: r.competitors || null,
            marketPositioning: r.marketPositioning || null,
            strengths: r.strengths || null,
            weaknesses: r.weaknesses || null,
          }),
        ),
        this.runStep<RevenueModelSchema>(
          id,
          REVENUE_MODEL_PROMPT,
          userPrompt,
          r => ({
            revenueModel: r.revenueModel || null,
            pricingAssumptions: r.pricingAssumptions || null,
            monetizationOpportunities: r.monetizationOpportunities || null,
          }),
        ),
        this.runStep<ArchitectureSchema>(
          id,
          ARCHITECTURE_PROMPT,
          userPrompt,
          r => ({
            frontendArchitecture: r.frontendArchitecture || null,
            backendArchitecture: r.backendArchitecture || null,
            infrastructureSuggestions: r.infrastructureSuggestions || null,
          }),
        ),
        this.runStep<DatabaseSchemaGen>(
          id,
          DATABASE_PROMPT,
          userPrompt,
          r => ({
            databaseSchema: r.databaseSchema || null,
            prismaSchemaSuggestions: r.prismaSchemaSuggestions || null,
            databaseEntities: r.databaseEntities || null,
          }),
        ),
        this.runStep<ApiDesignSchema>(
          id,
          API_DESIGN_PROMPT,
          userPrompt,
          r => ({
            restEndpoints: r.restEndpoints || null,
            requestDtos: r.requestDtos || null,
            responseDtos: r.responseDtos || null,
          }),
        ),
        this.runStep<MvpRoadmapSchema>(
          id,
          MVP_ROADMAP_PROMPT,
          userPrompt,
          r => ({
            developmentPhases: r.developmentPhases || null,
            timeline: r.timeline || null,
            milestones: r.milestones || null,
          }),
        ),
      ]

      const results = await Promise.allSettled(steps)
      const failed = results.filter(r => r.status === 'rejected')
      failed.forEach(r => this.logger.error(`Analysis ${id}: step failed`, (r as PromiseRejectedResult).reason))

      if (failed.length === steps.length) {
        throw new Error('All analysis steps failed')
      }

      await this.updateWithRetry(id, { status: AnalysisStatus.COMPLETED })
    } catch (error) {
      this.logger.error(`Processing failed for ${id}`, error)
      try {
        await this.updateWithRetry(id, { status: AnalysisStatus.FAILED })
      } catch (updateError) {
        this.logger.error(`Failed to mark analysis ${id} as FAILED`, updateError)
      }
    }
  }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit
    const [data, total] = await Promise.all([
      this.prisma.analysis.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          url: true,
          title: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.analysis.count(),
    ])

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  async findOne(id: string) {
    const analysis = await this.prisma.analysis.findUnique({ where: { id } })
    if (!analysis) throw new NotFoundException('Analysis not found')
    return analysis
  }

  async remove(id: string) {
    await this.findOne(id)
    return this.prisma.analysis.delete({ where: { id } })
  }
}
