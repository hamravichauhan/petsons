import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductSpecification } from './entities/product-specification.entity';
import { PackagingUnit } from './entities/packaging-unit.entity';

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    @InjectRepository(ProductSpecification)
    private specRepo: Repository<ProductSpecification>,
    @InjectRepository(PackagingUnit)
    private packagingRepo: Repository<PackagingUnit>,
  ) {}

  async findAll() {
    const products = await this.productRepo.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });

    return { products, total: products.length };
  }

  async findBySlug(slug: string) {
    const product = await this.productRepo.findOne({
      where: { slug, isActive: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const specs = await this.specRepo.findOne({
      where: { productId: product.id },
    });

    const packaging = await this.packagingRepo.find({
      where: { productId: product.id, isActive: true },
    });

    return { ...product, specifications: specs || null, packagingUnits: packaging };
  }
}