import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './prisma/prisma.module'
import { AnalysesModule } from './analyses/analyses.module'
import { AiModule } from './ai/ai.module'
import { FetchModule } from './fetch/fetch.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    FetchModule,
    AiModule,
    AnalysesModule,
  ],
})
export class AppModule {}
