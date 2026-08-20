import { Injectable, Logger } from '@nestjs/common'
import axios from 'axios'
import * as cheerio from 'cheerio'

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

  async fetchContent(url: string): Promise<FetchedContent> {
    try {
      const response = await axios.get(url, {
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SaaSAnalyzer/1.0)',
          Accept: 'text/html,application/xhtml+xml',
        },
        maxRedirects: 5,
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
      this.logger.error(`Failed to fetch URL: ${url}`, error)
      throw new Error(`Unable to fetch content from ${url}. Please check the URL and try again.`)
    }
  }
}
