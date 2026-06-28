import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecallService } from './recall.service';
import { RecallController } from './recall.controller';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [RecallController],
  providers: [RecallService],
  exports: [RecallService],
})
export class ComplianceModule {}