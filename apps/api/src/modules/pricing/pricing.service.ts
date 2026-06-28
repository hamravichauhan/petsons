import { Injectable, NotFoundException, Logger } from '@nestjs/common';
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
  organizationId?: string;
}

export interface ResolvedPrice {
  productId: string;
  productName: string;
  packagingType: string;
  quantity: number;
  baseMsrp: number;
  tierPrice: number;
  volumeDiscount: number;
  contractPrice: number | null;
  finalPrice: number;
  costPerUnit: number;
  yieldPerUnit: number;
  costPerFinishedUnit: number;
  tier: string;
  pricingSource: 'MATRIX' | 'TIER' | 'BASE';
}

@Injectable()
export class PricingService {
  private readonly logger = new Logger(PricingService.name);
  
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

    // STEP 1: Check Matrix Pricing
    if (query.organizationId) {
      const matrixPrice = await this.getMatrixPrice(
        query.organizationId, query.productId, query.packagingUnitId,
      );
      
      if (matrixPrice !== null) {
        this.logger.log(`MATRIX pricing applied: $${matrixPrice}`);
        return this.buildResponse(product, packaging, specs, matrixPrice, 0, query.quantity, tier, 'MATRIX');
      }
    }

    // STEP 2: Tier pricing
    const tierDiscount = this.tierDiscounts[tier] || 0;
    const tierPrice = Number(product.baseMsrp) * (1 - tierDiscount / 100);

    // STEP 3: Volume discount
    const vol = this.volumeDiscounts.find(v => query.quantity >= v.minQty && query.quantity <= v.maxQty);
    const volDiscount = vol ? vol.discount : 0;
    const finalPrice = tierPrice * (1 - volDiscount / 100);

    return this.buildResponse(product, packaging, specs, finalPrice, volDiscount, query.quantity, tier, 'TIER');
  }

  private async getMatrixPrice(orgId: string, productId: string, packagingId: string): Promise<number | null> {
    const result = await this.productRepo.manager.query(
      `SELECT custom_price FROM custom_pricing 
       WHERE organization_id = $1 
       AND product_id = $2 
       AND packaging_unit_id = $3
       AND is_active = TRUE 
       AND (valid_until IS NULL OR valid_until > NOW())`,
      [orgId, productId, packagingId],
    );
    
    this.logger.log(`Matrix query for org=${orgId} product=${productId}: found ${result.length} rows`);
    
    if (result.length > 0) {
      return Number(result[0].custom_price);
    }
    return null;
  }

  private buildResponse(
    product: Product, packaging: PackagingUnit, specs: ProductSpecification | null,
    finalPrice: number, volDiscount: number, quantity: number, tier: string,
    pricingSource: 'MATRIX' | 'TIER' | 'BASE',
  ): ResolvedPrice {
    const ratio = specs?.dilutionRatio ? parseInt(specs.dilutionRatio.split(':')[0], 10) : 1;
    const yieldPerUnit = Number(packaging.quantityInBaseUnit) * ratio;
    const costPerFinished = yieldPerUnit > 0 ? finalPrice / yieldPerUnit : 0;

    return {
      productId: product.id,
      productName: product.name,
      packagingType: packaging.unitType,
      quantity,
      baseMsrp: Number(product.baseMsrp),
      tierPrice: Math.round(finalPrice * 100) / 100,
      volumeDiscount: volDiscount,
      contractPrice: pricingSource === 'MATRIX' ? finalPrice : null,
      finalPrice: Math.round(finalPrice * 100) / 100,
      costPerUnit: Math.round(finalPrice * 100) / 100,
      yieldPerUnit,
      costPerFinishedUnit: Math.round(costPerFinished * 100) / 100,
      tier,
      pricingSource,
    };
  }
}