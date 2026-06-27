import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../catalog/entities/product.entity';
import { PackagingUnit } from '../catalog/entities/packaging-unit.entity';
import { ProductSpecification } from '../catalog/entities/product-specification.entity';

export interface PricingQuery {
  productId: string;
  packagingUnitId: string;
  quantity: number;
  tier?: string;
}

export interface ResolvedPrice {
  productId: string;
  productName: string;
  packagingType: string;
  quantity: number;
  baseMsrp: number;
  tierPrice: number;
  volumeDiscount: number;
  finalPrice: number;
  costPerUnit: number;
  yieldPerUnit: number;
  costPerFinishedUnit: number;
  tier: string;
}

@Injectable()
export class PricingService {
  private tierDiscounts: Record<string, number> = {
    PENDING: 0, BRONZE: 0, SILVER: 5, GOLD: 12, VIP: 20,
  };

  private volumeDiscounts = [
    { minQty: 1, maxQty: 10, discount: 0 },
    { minQty: 11, maxQty: 50, discount: 3 },
    { minQty: 51, maxQty: 100, discount: 7 },
    { minQty: 101, maxQty: Infinity, discount: 10 },
  ];

  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(PackagingUnit) private packagingRepo: Repository<PackagingUnit>,
    @InjectRepository(ProductSpecification) private specRepo: Repository<ProductSpecification>,
  ) {}

  async calculatePrice(query: PricingQuery): Promise<ResolvedPrice> {
    const product = await this.productRepo.findOne({ where: { id: query.productId, isActive: true } });
    if (!product) throw new NotFoundException('Product not found');

    const packaging = await this.packagingRepo.findOne({ where: { id: query.packagingUnitId, isActive: true } });
    if (!packaging) throw new NotFoundException('Packaging not found');

    const specs = await this.specRepo.findOne({ where: { productId: product.id } });

    const tier = query.tier || 'BRONZE';
    const tierDiscount = this.tierDiscounts[tier] || 0;
    const tierPrice = Number(product.baseMsrp) * (1 - tierDiscount / 100);

    const vol = this.volumeDiscounts.find(v => query.quantity >= v.minQty && query.quantity <= v.maxQty);
    const volDiscount = vol ? vol.discount : 0;
    const finalPrice = tierPrice * (1 - volDiscount / 100);

    const ratio = specs?.dilutionRatio ? parseInt(specs.dilutionRatio.split(':')[0], 10) : 1;
    const yieldPerUnit = Number(packaging.quantityInBaseUnit) * ratio;
    const costPerFinished = yieldPerUnit > 0 ? finalPrice / yieldPerUnit : 0;

    return {
      productId: product.id,
      productName: product.name,
      packagingType: packaging.unitType,
      quantity: query.quantity,
      baseMsrp: Number(product.baseMsrp),
      tierPrice: Math.round(tierPrice * 100) / 100,
      volumeDiscount: volDiscount,
      finalPrice: Math.round(finalPrice * 100) / 100,
      costPerUnit: Math.round(finalPrice * 100) / 100,
      yieldPerUnit,
      costPerFinishedUnit: Math.round(costPerFinished * 100) / 100,
      tier,
    };
  }
}