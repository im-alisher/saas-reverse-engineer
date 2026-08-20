import { AnalysisStatus } from '@prisma/client'

export class AnalysisResponseDto {
  id!: string
  url!: string
  title?: string | null
  status!: AnalysisStatus
  createdAt!: Date
  updatedAt!: Date
}
