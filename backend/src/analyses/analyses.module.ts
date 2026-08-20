import { Module } from '@nestjs/common'
import { AnalysesController } from './analyses.controller'
import { AnalysesService } from './analyses.service'
import { FetchModule } from '../fetch/fetch.module'

@Module({
  imports: [FetchModule],
  controllers: [AnalysesController],
  providers: [AnalysesService],
})
export class AnalysesModule {}
