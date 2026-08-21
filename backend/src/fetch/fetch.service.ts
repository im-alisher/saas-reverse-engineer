import { Injectable, Logger } from '@nestjs/common'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { isIP } from 'node:net'
import { lookup } from 'node:dns/promises'

export interface FetchedContent {
  title: string
  description: string
  content: string
  links: string[]
  meta: Record<string, string>
}

@Injectable()
export class FetchService {
  private readonly logger = new Logger(FetchService.name)

  async fetchContent(url: string, retries = 3): Promise<FetchedContent> {
    await this.assertPublicUrl(url)
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await axios.get(url, {
          timeout: 45000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
          },
          maxRedirects: 0,
        })

        const $ = cheerio.load(response.data)

        $('script, style, noscript, iframe, svg, nav, footer, header').remove()

        const title = $('title').text().trim() || $('h1').first().text().trim()
        const description =
          $('meta[name="description"]').attr('content') ||
          $('meta[property="og:description"]').attr('content') ||
          ''

        const meta: Record<string, string> = {}
        $('meta').each((_, el) => {
          const name = $(el).attr('name') || $(el).attr('property')
          const content = $(el).attr('content')
          if (name && content) meta[name] = content
        })

        const bodyText = $('body').text().replace(/\s+/g, ' ').trim()
        const content = bodyText.substring(0, 10000)

        const links: string[] = []
        $('a[href]').each((_, el) => {
          const href = $(el).attr('href')
          if (href && href.startsWith('http')) links.push(href)
        })

        return { title, description, content, links: [...new Set(links)].slice(0, 50), meta }
      } catch (error) {
        this.logger.warn(`Attempt ${attempt}/${retries} failed for ${url}: ${(error as Error).message}`)
        if (attempt === retries) {
          throw new Error(`Unable to fetch content from ${url}. Please check the URL and try again.`)
        }
        await new Promise(r => setTimeout(r, 2000 * attempt))
      }
    }
    throw new Error(`Unable to fetch content from ${url}. Please check the URL and try again.`)
  }

  private async assertPublicUrl(value: string): Promise<void> {
    const url = new URL(value)
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
      throw new Error('Only public HTTP and HTTPS URLs without embedded credentials are allowed.')
    }

    const addresses = await lookup(url.hostname, { all: true })
    if (!addresses.length || addresses.some(({ address }) => this.isPrivateAddress(address))) {
      throw new Error('Private or local network addresses are not allowed.')
    }
  }

  private isPrivateAddress(address: string): boolean {
    const normalized = address.toLowerCase().replace(/^::ffff:/, '')
    if (normalized === '::1' || normalized === '::' || normalized.startsWith('fc') || normalized.startsWith('fd') || normalized.startsWith('fe8') || normalized.startsWith('fe9') || normalized.startsWith('fea') || normalized.startsWith('feb')) return true
    if (isIP(normalized) !== 4) return false

    const [a, b] = normalized.split('.').map(Number)
    return a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127) || a >= 224
  }
}
