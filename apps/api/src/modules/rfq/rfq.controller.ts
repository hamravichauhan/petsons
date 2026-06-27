import { Controller, Get, Post, Param, Body, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { RfqService } from './rfq.service';

@Controller('rfq')
export class RfqController {
  constructor(private readonly rfqService: RfqService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: any) {
    return this.rfqService.create(body);
  }

  @Get()
  findAll(@Query('organizationId') organizationId: string) {
    if (!organizationId) {
      return { rfqs: [], message: 'Provide organizationId query parameter' };
    }
    return this.rfqService.findAll(organizationId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rfqService.findOne(id);
  }

  @Post(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.rfqService.updateStatus(id, status);
  }
}
