import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RfqController } from './rfq.controller';
import { RfqService } from './rfq.service';
import { RfqRequest } from './entities/rfq.entity';
import { RfqItem } from './entities/rfq-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RfqRequest, RfqItem])],
  controllers: [RfqController],
  providers: [RfqService],
  exports: [RfqService],
})
export class RfqModule {}