import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { Product } from './entities/product.entity';
import { ProductSpecification } from './entities/product-specification.entity';
import { PackagingUnit } from './entities/packaging-unit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductSpecification, PackagingUnit])],
  controllers: [CatalogController],
  providers: [CatalogService],
  exports: [CatalogService],
})
export class CatalogModule {}