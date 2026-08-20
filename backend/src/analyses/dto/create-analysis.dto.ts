import { IsUrl, IsNotEmpty } from 'class-validator'

export class CreateAnalysisDto {
  @IsUrl({}, { message: 'Please provide a valid URL' })
  @IsNotEmpty()
  url!: string
}
