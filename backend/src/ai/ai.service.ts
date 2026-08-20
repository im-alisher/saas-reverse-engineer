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
      baseURL: this.config.get<string>('GROQ_BASE_URL', 'https://api.groq.com/openai/v1'),
    })
  }

  private extractJson(raw: string): string {
    const codeBlockMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (codeBlockMatch) return codeBlockMatch[1].trim()

    const firstBrace = raw.indexOf('{')
    const lastBrace = raw.lastIndexOf('}')
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      return raw.substring(firstBrace, lastBrace + 1)
    }

    const firstBracket = raw.indexOf('[')
    const lastBracket = raw.lastIndexOf(']')
    if (firstBracket >= 0 && lastBracket > firstBracket) {
      return raw.substring(firstBracket, lastBracket + 1)
    }

    return raw.trim()
  }

  private repairJson(raw: string): string {
    let s = raw.trim()
    s = s.replace(/,\s*([\]}])/g, '$1')
    s = s.replace(/:\s*"([^"]*)"([^",\]}])/g, ': "$1"$2')
    return s
  }

  private parseJsonResponse<T>(content: string): T {
    const extracted = this.extractJson(content)

    try {
      return JSON.parse(extracted) as T
    } catch {
      const repaired = this.repairJson(extracted)
      this.logger.warn('JSON parse failed, attempting repair')
      try {
        return JSON.parse(repaired) as T
      } catch (e) {
        this.logger.warn(`JSON repair failed: ${(e as Error).message}`)
        return {} as T
      }
    }
  }

  async generateStructuredResponse<T>(
    systemPrompt: string,
    userPrompt: string,
  ): Promise<T> {
    const fullSystem = `${systemPrompt}

CRITICAL RULES:
- Return ONLY valid JSON. No markdown, no code blocks, no explanations, no text before or after.
- Start your response with { and end with }
- Do not include any conversational text, headers, or formatting.`

    const maxRetries = 5
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await this.groq.chat.completions.create({
          model: this.config.get<string>('AI_MODEL', 'openai/gpt-oss-120b'),
          messages: [
            { role: 'system', content: fullSystem },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.3,
          max_tokens: 2048,
        })

        const content = response.choices[0]?.message?.content
        if (!content) throw new Error('No content in AI response')

        try {
          return this.parseJsonResponse<T>(content)
        } catch (parseErr) {
          this.logger.warn(`JSON parse failed on attempt ${attempt}/${maxRetries}`)
          if (attempt < maxRetries) {
            await new Promise(r => setTimeout(r, 3000))
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
        throw error
      }
    }
    throw new Error('AI generation failed after max retries')
  }
}
