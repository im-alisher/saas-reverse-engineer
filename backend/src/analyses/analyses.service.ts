import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { FetchService } from '../fetch/fetch.service'
import { AiService } from '../ai/ai.service'
import { CreateAnalysisDto } from './dto/create-analysis.dto'
import { AnalysisStatus } from '@prisma/client'
import { PRODUCT_SUMMARY_PROMPT } from '../ai/prompts/product-summary.prompt'
import { FEATURES_PROMPT } from '../ai/prompts/features.prompt'
import type { ProductSummarySchema } from '../ai/schemas/product-summary.schema'
import type { FeaturesSchema } from '../ai/schemas/features.schema'

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
