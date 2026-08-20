import { Module } from '@nestjs/common'
import { AnalysesController } from './analyses.controller'
import { AnalysesService } from './analyses.service'
import { FetchModule } from '../fetch/fetch.module'
import { AiModule } from '../ai/ai.module'

@Module({
  imports: [FetchModule, AiModule],
  controllers: [AnalysesController],
  providers: [AnalysesService],
})
export class AnalysesModule {}
