import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { RecallService } from './recall.service';

@Controller('compliance')
export class RecallController {
  constructor(private readonly recallService: RecallService) {}

  @Get('trace/:lotNumber')
  trace(@Param('lotNumber') lotNumber: string) {
    return this.recallService.traceBatch(lotNumber);
  }

  @Post('recall')
  initiate(
    @Body() body: { lotNumber: string; reason: string; classification: string },
  ) {
    return this.recallService.initiateRecall(
      body.lotNumber,
      body.reason,
      body.classification || 'VOLUNTARY',
    );
  }
}