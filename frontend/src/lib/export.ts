import type { Analysis } from '../types'

export function exportAsMarkdown(analysis: Analysis): string {
  let md = `# ${analysis.title || 'SaaS Analysis'}\n\n`
  md += `**URL:** ${analysis.url}\n`
  md += `**Date:** ${new Date(analysis.createdAt).toLocaleDateString()}\n\n`

  if (analysis.productSummary) {
    md += `## Product Summary\n\n`
    md += `**Name:** ${analysis.productSummary.name}\n`
    md += `**Category:** ${analysis.productSummary.category}\n`
    md += `**Tagline:** ${analysis.productSummary.tagline}\n\n`
    md += `${analysis.productSummary.overview}\n\n`
  }

  if (analysis.businessDescription) {
    md += `## Business Description\n\n${analysis.businessDescription}\n\n`
  }

  if (analysis.targetAudience) {
    md += `## Target Audience\n\n${analysis.targetAudience}\n\n`
  }

  if (analysis.coreFeatures?.features?.length) {
    md += `## Core Features\n\n`
    analysis.coreFeatures.features.forEach((f) => {
      md += `- **${f.name}** (${f.priority}): ${f.description}\n`
    })
    md += `\n`
  }

  if (analysis.valuePropositions?.length) {
    md += `## Value Propositions\n\n`
    analysis.valuePropositions.forEach((vp) => { md += `- ${vp}\n` })
    md += `\n`
  }

  if (analysis.competitors?.length) {
    md += `## Competitors\n\n`
    analysis.competitors.forEach((c) => {
      md += `### ${c.name}\n${c.description}\n`
      md += `- Strengths: ${c.strengths.join(', ')}\n`
      md += `- Weaknesses: ${c.weaknesses.join(', ')}\n\n`
    })
  }

  if (analysis.revenueModel) {
    md += `## Revenue Model\n\n`
    md += `**Model:** ${analysis.revenueModel.model}\n`
    md += `**Description:** ${analysis.revenueModel.description}\n`
    md += `**Estimated Price:** ${analysis.revenueModel.estimatedPrice}\n\n`
  }

  if (analysis.frontendArchitecture) {
    md += `## Frontend Architecture\n\n`
    md += `**Framework:** ${analysis.frontendArchitecture.framework}\n`
    md += `${analysis.frontendArchitecture.description}\n\n`
  }

  if (analysis.backendArchitecture) {
    md += `## Backend Architecture\n\n`
    md += `**Framework:** ${analysis.backendArchitecture.framework}\n`
    md += `${analysis.backendArchitecture.description}\n\n`
  }

  if (analysis.databaseSchema) {
    md += `## Database Schema\n\n`
    md += `${analysis.databaseSchema.description}\n\n`
    md += `\`\`\`prisma\n${analysis.databaseSchema.entities}\n\`\`\`\n\n`
  }

  if (analysis.restEndpoints?.length) {
    md += `## API Endpoints\n\n`
    analysis.restEndpoints.forEach((ep) => {
      md += `- **${ep.method}** ${ep.path} - ${ep.description}\n`
    })
    md += `\n`
  }

  if (analysis.developmentPhases?.length) {
    md += `## MVP Roadmap\n\n`
    analysis.developmentPhases.forEach((p) => {
      md += `### ${p.name} (${p.duration})\n${p.description}\n`
      p.tasks.forEach((t) => { md += `- ${t}\n` })
      md += `\n`
    })
  }

  if (analysis.milestones?.length) {
    md += `## Milestones\n\n`
    analysis.milestones.forEach((m) => {
      md += `### ${m.name}\n${m.description}\n`
      md += `Deliverables: ${m.deliverables.join(', ')}\n\n`
    })
  }

  return md
}

export function exportAsJson(analysis: Analysis): string {
  return JSON.stringify(analysis, null, 2)
}

export function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text)
}
