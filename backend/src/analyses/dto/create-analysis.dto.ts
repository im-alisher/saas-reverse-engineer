import { IsUrl, IsNotEmpty, MaxLength } from 'class-validator'

export class CreateAnalysisDto {
  @IsUrl({ protocols: ['http', 'https'] }, { message: 'Please provide a valid HTTP or HTTPS URL' })
  @IsNotEmpty({ message: 'URL is required' })
  @MaxLength(2048, { message: 'URL must be less than 2048 characters' })
  url!: string
}
