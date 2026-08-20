const API_BASE = '/api/v1'

export const api = {
  async createAnalysis(url: string) {
    const response = await fetch(`${API_BASE}/analyses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to create analysis')
    }
    return response.json()
  },

  async getAnalysis(id: string) {
    const response = await fetch(`${API_BASE}/analyses/${id}`)
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to fetch analysis')
    }
    return response.json()
  },

  async listAnalyses(page = 1, limit = 20) {
    const response = await fetch(`${API_BASE}/analyses?page=${page}&limit=${limit}`)
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to fetch analyses')
    }
    return response.json()
  },

  async deleteAnalysis(id: string) {
    const response = await fetch(`${API_BASE}/analyses/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to delete analysis')
    }
  },
}
