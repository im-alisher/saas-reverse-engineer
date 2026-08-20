import { Controller, Get, Post, Delete, Body, Param, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common'
import { AnalysesService } from './analyses.service'
import { CreateAnalysisDto } from './dto/create-analysis.dto'

@Controller('analyses')
export class AnalysesController {
  constructor(private readonly analysesService: AnalysesService) {}

  @Post()
  create(@Body() dto: CreateAnalysisDto) {
    return this.analysesService.create(dto)
  }

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.analysesService.findAll(page, Math.min(limit, 100))
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.analysesService.findOne(id)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.analysesService.remove(id)
  }
}
