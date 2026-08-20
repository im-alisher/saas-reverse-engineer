import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { FetchService } from '../fetch/fetch.service'
import { AiService } from '../ai/ai.service'
import { CreateAnalysisDto } from './dto/create-analysis.dto'
import { AnalysisStatus } from '@prisma/client'
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

  private async processAnalysis(id: string, url: string) {
    await this.prisma.analysis.update({
      where: { id },
      data: { status: AnalysisStatus.PROCESSING },
    })

    try {
      const content = await this.fetchService.fetchContent(url)

      const userPrompt = `Analyze this SaaS product:
URL: ${url}
Title: ${content.title}
Description: ${content.description}
Content: ${content.content.substring(0, 5000)}`

      const result = await this.aiService.generateStructuredResponse<ProductSummarySchema>(
        PRODUCT_SUMMARY_PROMPT,
        userPrompt,
      )

      await this.prisma.analysis.update({
        where: { id },
        data: {
          title: result.productSummary?.name || content.title,
          productSummary: result.productSummary || null,
          businessDescription: result.businessDescription || content.description,
          targetAudience: result.targetAudience || null,
        },
      })

      const featuresResult = await this.aiService.generateStructuredResponse<FeaturesSchema>(
        FEATURES_PROMPT,
        userPrompt,
      )

      await this.prisma.analysis.update({
        where: { id },
        data: {
          coreFeatures: featuresResult.coreFeatures || null,
          userWorkflows: featuresResult.userWorkflows || null,
          valuePropositions: featuresResult.valuePropositions || null,
        },
      })

      const competitorsResult = await this.aiService.generateStructuredResponse<CompetitorsSchema>(
        COMPETITORS_PROMPT,
        userPrompt,
      )

      await this.prisma.analysis.update({
        where: { id },
        data: {
          competitors: competitorsResult.competitors || null,
          marketPositioning: competitorsResult.marketPositioning || null,
          strengths: competitorsResult.strengths || null,
          weaknesses: competitorsResult.weaknesses || null,
        },
      })

      const revenueResult = await this.aiService.generateStructuredResponse<RevenueModelSchema>(
        REVENUE_MODEL_PROMPT,
        userPrompt,
      )

      await this.prisma.analysis.update({
        where: { id },
        data: {
          revenueModel: revenueResult.revenueModel || null,
          pricingAssumptions: revenueResult.pricingAssumptions || null,
          monetizationOpportunities: revenueResult.monetizationOpportunities || null,
        },
      })

      const archResult = await this.aiService.generateStructuredResponse<ArchitectureSchema>(
        ARCHITECTURE_PROMPT,
        userPrompt,
      )

      await this.prisma.analysis.update({
        where: { id },
        data: {
          frontendArchitecture: archResult.frontendArchitecture || null,
          backendArchitecture: archResult.backendArchitecture || null,
          infrastructureSuggestions: archResult.infrastructureSuggestions || null,
        },
      })

      const dbResult = await this.aiService.generateStructuredResponse<DatabaseSchemaGen>(
        DATABASE_PROMPT,
        userPrompt,
      )

      await this.prisma.analysis.update({
        where: { id },
        data: {
          databaseSchema: dbResult.databaseSchema || null,
          prismaSchemaSuggestions: dbResult.prismaSchemaSuggestions || null,
          databaseEntities: dbResult.databaseEntities || null,
        },
      })

      const apiResult = await this.aiService.generateStructuredResponse<ApiDesignSchema>(
        API_DESIGN_PROMPT,
        userPrompt,
      )

      await this.prisma.analysis.update({
        where: { id },
        data: {
          restEndpoints: apiResult.restEndpoints || null,
          requestDtos: apiResult.requestDtos || null,
          responseDtos: apiResult.responseDtos || null,
        },
      })

      const roadmapResult = await this.aiService.generateStructuredResponse<MvpRoadmapSchema>(
        MVP_ROADMAP_PROMPT,
        userPrompt,
      )

      await this.prisma.analysis.update({
        where: { id },
        data: {
          developmentPhases: roadmapResult.developmentPhases || null,
          timeline: roadmapResult.timeline || null,
          milestones: roadmapResult.milestones || null,
          status: AnalysisStatus.COMPLETED,
        },
      })
    } catch (error) {
      this.logger.error(`Processing failed for ${id}`, error)
      await this.prisma.analysis.update({
        where: { id },
        data: { status: AnalysisStatus.FAILED },
      })
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
