export interface ApiDesignSchema {
  restEndpoints: Array<{ method: string; path: string; description: string; requestBody?: string; responseBody?: string }>
  requestDtos: Array<{ name: string; fields: Array<{ name: string; type: string; required: boolean; description?: string }> }>
  responseDtos: Array<{ name: string; fields: Array<{ name: string; type: string; required: boolean; description?: string }> }>
}
