export interface DatabaseSchemaGen {
  databaseSchema: { entities: string; description: string }
  prismaSchemaSuggestions: string[]
  databaseEntities: Array<{ name: string; fields: Array<{ name: string; type: string; required: boolean }> }>
}
