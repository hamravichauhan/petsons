import { Controller, Get, Query } from '@nestjs/common';
import { PricingService } from './pricing.service';

@Controller('pricing')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Get('calculate')
  calculate(
    @Query('productId') productId: string,
    @Query('packagingUnitId') packagingUnitId: string,
    @Query('quantity') quantity: string,
    @Query('tier') tier: string,
  ) {
    return this.pricingService.calculatePrice({
      productId,
      packagingUnitId,
      quantity: parseInt(quantity, 10) || 1,
      tier: tier || 'BRONZE',
    });
  }

  @Get('tiers')
  getTiers() {
    return [
      { name: 'BRONZE', discount: 0, gmv: '$0 - $4,999' },
      { name: 'SILVER', discount: 5, gmv: '$5,000 - $14,999' },
      { name: 'GOLD', discount: 12, gmv: '$15,000 - $49,999' },
      { name: 'VIP', discount: 20, gmv: '$50,000+' },
    ];
  }
}