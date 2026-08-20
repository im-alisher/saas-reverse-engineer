export interface ArchitectureSchema {
  frontendArchitecture: { framework: string; description: string; keyComponents: string[] }
  backendArchitecture: { framework: string; description: string; keyComponents: string[] }
  infrastructureSuggestions: string[]
}
