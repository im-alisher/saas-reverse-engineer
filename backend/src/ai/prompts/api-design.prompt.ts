export const API_DESIGN_PROMPT = `You are an API architect. Design REST API endpoints for this SaaS product.

IMPORTANT: Keep it concise. Max 10 endpoints, max 5 request DTOs, max 5 response DTOs.

Return JSON with this exact structure:
{
  "restEndpoints": [{ "method": "GET|POST|PUT|DELETE", "path": "/api/resource", "description": "What it does", "requestBody": null, "responseBody": "Description" }],
  "requestDtos": [{ "name": "DtoName", "fields": [{ "name": "field", "type": "string", "required": true, "description": "desc" }] }],
  "responseDtos": [{ "name": "DtoName", "fields": [{ "name": "field", "type": "string", "required": true, "description": "desc" }] }]
}`
