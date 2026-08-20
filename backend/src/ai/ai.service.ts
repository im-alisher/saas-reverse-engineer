import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Groq from 'groq-sdk'

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name)
  private readonly groq: Groq

  constructor(private config: ConfigService) {
    this.groq = new Groq({
      apiKey: this.config.get<string>('GROQ_API_KEY'),
    })
  }

  private repairJson(raw: string): string {
    let s = raw.trim()

    const jsonMatch = s.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (jsonMatch) s = jsonMatch[1].trim()

    const firstBrace = s.indexOf('{')
    const lastBrace = s.lastIndexOf('}')
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      s = s.substring(firstBrace, lastBrace + 1)
    }

    s = s.replace(/,\s*([\]}])/g, '$1')
    s = s.replace(/'/g, '"')

    return s
  }

  private parseJsonResponse<T>(content: string): T {
    try {
      return JSON.parse(content) as T
    } catch {
      const repaired = this.repairJson(content)
      this.logger.warn('JSON parse failed, attempting repair')
      try {
        return JSON.parse(repaired) as T
      } catch {
        this.logger.warn('JSON repair also failed, returning empty object')
        return {} as T
      }
    }
  }

  async generateStructuredResponse<T>(
    systemPrompt: string,
    userPrompt: string,
  ): Promise<T> {
    const maxRetries = 5
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await this.groq.chat.completions.create({
          model: 'openai/gpt-oss-120b',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.3,
          max_tokens: 2048,
          response_format: { type: 'json_object' },
        })

        const content = response.choices[0]?.message?.content
        if (!content) throw new Error('No content in AI response')

        try {
          return this.parseJsonResponse<T>(content)
        } catch (parseErr) {
          this.logger.warn(`JSON parse failed on attempt ${attempt}, retrying`)
          if (attempt < maxRetries) {
            await new Promise(r => setTimeout(r, 5000))
            continue
          }
          throw parseErr
        }
      } catch (error: any) {
        if (error?.status === 429 && attempt < maxRetries) {
          const waitMs = 15000 * attempt
          this.logger.warn(`Rate limited, waiting ${waitMs / 1000}s before retry ${attempt}/${maxRetries}`)
          await new Promise(r => setTimeout(r, waitMs))
          continue
        }
        this.logger.error('AI generation failed', error)
        if (error instanceof SyntaxError) {
          throw new Error('AI returned invalid JSON response')
        }
        throw error
      }
    }
    throw new Error('AI generation failed after max retries')
  }
}
