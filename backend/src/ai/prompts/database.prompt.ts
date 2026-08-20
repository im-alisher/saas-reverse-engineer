export const DATABASE_PROMPT = `You are a database architect. Design a database schema for this SaaS product.

IMPORTANT: Keep it concise. Max 6 entities, max 5 fields each.

Return JSON with this exact structure:
{
  "databaseSchema": { "entities": "Prisma schema text", "description": "Overview" },
  "prismaSchemaSuggestions": ["Suggestion 1", "Suggestion 2"],
  "databaseEntities": [{ "name": "Entity", "fields": [{ "name": "field", "type": "String", "required": true }] }]
}`
