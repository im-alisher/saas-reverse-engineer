import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import OpenAI from 'openai'

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name)
  private readonly client: OpenAI
  private readonly model: string

  constructor(private config: ConfigService) {
    this.model = config.get<string>('AI_MODEL', 'gpt-oss-120b')
    this.client = new OpenAI({
      apiKey: config.getOrThrow<string>('GROQ_API_KEY'),
      baseURL: config.get<string>('GROQ_BASE_URL', 'https://api.groq.com/openai/v1'),
    })
    this.logger.log(`AI provider: ${this.client.baseURL} | model: ${this.model}`)
  }

  private extractJson(raw: string): string {
    const codeBlockMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (codeBlockMatch) return codeBlockMatch[1].trim()

    const firstBrace = raw.indexOf('{')
    const lastBrace = raw.lastIndexOf('}')
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      return raw.substring(firstBrace, lastBrace + 1)
    }
    return raw.trim()
  }

  private repairJson(raw: string): string {
    let s = raw.trim()

    s = s.replace(/,\s*([\]}])/g, '$1')
    s = s.replace(/:\s*"([^"]*)"([^",}\]])/g, ': "$1"$2')

    let openBraces = 0
    let openBrackets = 0
    let inString = false
    let escaped = false
    for (const ch of s) {
      if (escaped) { escaped = false; continue }
      if (ch === '\\') { escaped = true; continue }
      if (ch === '"') { inString = !inString; continue }
      if (inString) continue
      if (ch === '{') openBraces++
      if (ch === '}') openBraces--
      if (ch === '[') openBrackets++
      if (ch === ']') openBrackets--
    }
    while (openBrackets > 0) { s += ']'; openBrackets-- }
    while (openBraces > 0) { s += '}'; openBraces-- }

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
        const response = await this.client.chat.completions.create({
          model: this.model,
          messages: [
            { role: 'system', content: fullSystem },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.3,
          max_tokens: 4096,
        })

        const content = response.choices[0]?.message?.content
        if (!content) throw new Error('No content in AI response')

        const parsed = this.parseJsonResponse<T>(content)
        if (Object.keys(parsed as object).length === 0) {
          this.logger.warn(`Empty JSON on attempt ${attempt}/${maxRetries}`)
          if (attempt < maxRetries) {
            await new Promise(r => setTimeout(r, 3000))
            continue
          }
        }
        return parsed
      } catch (error: unknown) {
        const status = this.getErrorStatus(error)
        if (status === 429 && attempt < maxRetries) {
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

  private getErrorStatus(error: unknown): number | undefined {
    if (typeof error !== 'object' || error === null || !('status' in error)) return undefined
    return typeof error.status === 'number' ? error.status : undefined
  }
}
