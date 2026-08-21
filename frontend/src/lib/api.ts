const API_BASE = `${(import.meta.env.VITE_API_URL || '').replace(/\/$/, '')}/api/v1`

async function errorMessage(response: Response, fallback: string): Promise<string> {
  try {
    const body = await response.json() as { message?: string | string[] }
    return Array.isArray(body.message) ? body.message.join(', ') : body.message || fallback
  } catch {
    return fallback
  }
}

export const api = {
  async createAnalysis(url: string) {
    const response = await fetch(`${API_BASE}/analyses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    })
    if (!response.ok) {
      throw new Error(await errorMessage(response, 'Failed to create analysis'))
    }
    return response.json()
  },

  async getAnalysis(id: string) {
    const response = await fetch(`${API_BASE}/analyses/${id}`)
    if (!response.ok) {
      throw new Error(await errorMessage(response, 'Failed to fetch analysis'))
    }
    return response.json()
  },

  async listAnalyses(page = 1, limit = 20) {
    const response = await fetch(`${API_BASE}/analyses?page=${page}&limit=${limit}`)
    if (!response.ok) {
      throw new Error(await errorMessage(response, 'Failed to fetch analyses'))
    }
    return response.json()
  },

  async deleteAnalysis(id: string) {
    const response = await fetch(`${API_BASE}/analyses/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error(await errorMessage(response, 'Failed to delete analysis'))
    }
  },
}
