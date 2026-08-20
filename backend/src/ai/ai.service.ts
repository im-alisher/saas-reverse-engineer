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

  async generateStructuredResponse<T>(
    systemPrompt: string,
    userPrompt: string,
  ): Promise<T> {
    const maxRetries = 5
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await this.groq.chat.completions.create({
          model: 'openai/gpt-oss-20b',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.3,
          max_tokens: 4096,
          response_format: { type: 'json_object' },
        })

        const content = response.choices[0]?.message?.content
        if (!content) throw new Error('No content in AI response')

        return JSON.parse(content) as T
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
