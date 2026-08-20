import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { FetchService } from '../fetch/fetch.service'
import { AiService } from '../ai/ai.service'
import { CreateAnalysisDto } from './dto/create-analysis.dto'
import { AnalysisStatus } from '@prisma/client'

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

      const analysisPrompt = `Analyze this SaaS product based on the following web content:

URL: ${url}
Title: ${content.title}
Description: ${content.description}
Content: ${content.content.substring(0, 5000)}

Provide a comprehensive analysis including:
1. Product name and overview
2. Core features (list top 5-8 features)
3. Target audience
4. Revenue model estimation
5. Suggested tech architecture

Return your response as JSON with this structure:
{
  "title": "Product Name",
  "productSummary": { "name": "...", "overview": "...", "category": "...", "tagline": "..." },
  "coreFeatures": { "features": [{ "name": "...", "description": "...", "priority": "high|medium|low" }] },
  "targetAudience": "...",
  "revenueModel": { "model": "...", "description": "...", "estimatedPrice": "..." },
  "frontendArchitecture": { "framework": "...", "description": "...", "keyComponents": ["..."] },
  "backendArchitecture": { "framework": "...", "description": "...", "keyComponents": ["..."] }
}`

      const result = await this.aiService.generateStructuredResponse<Record<string, any>>(
        'You are a SaaS product analyst. Analyze the provided web content and return structured JSON.',
        analysisPrompt,
      )

      await this.prisma.analysis.update({
        where: { id },
        data: {
          title: result.title || content.title,
          productSummary: result.productSummary || null,
          businessDescription: result.productSummary?.overview || content.description,
          targetAudience: result.targetAudience || null,
          coreFeatures: result.coreFeatures || null,
          revenueModel: result.revenueModel || null,
          frontendArchitecture: result.frontendArchitecture || null,
          backendArchitecture: result.backendArchitecture || null,
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
