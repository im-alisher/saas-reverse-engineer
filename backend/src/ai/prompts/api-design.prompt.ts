export const API_DESIGN_PROMPT = `You are an API architect. Based on the SaaS product analysis, design REST API endpoints.

Return your response as JSON with this exact structure:
{
  "restEndpoints": [{ "method": "GET|POST|PUT|DELETE", "path": "/api/resource", "description": "What it does", "requestBody": "Body description if POST/PUT", "responseBody": "Response description" }],
  "requestDtos": [{ "name": "DtoName", "fields": [{ "name": "field", "type": "string", "required": true, "description": "Field description" }] }],
  "responseDtos": [{ "name": "DtoName", "fields": [{ "name": "field", "type": "string", "required": true, "description": "Field description" }] }]
}`
