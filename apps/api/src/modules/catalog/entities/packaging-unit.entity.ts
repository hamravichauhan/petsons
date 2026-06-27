import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('packaging_units')
export class PackagingUnit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  @Column({ name: 'unit_type', type: 'varchar', length: 50 })
  unitType: string;

  @Column({ name: 'quantity_in_base_unit', type: 'decimal', precision: 15, scale: 6 })
  quantityInBaseUnit: number;

  @Column({ name: 'base_unit', type: 'varchar', length: 20, default: 'GALLON' })
  baseUnit: string;

  @Column({ name: 'weight_kg', type: 'decimal', precision: 10, scale: 3, nullable: true })
  weightKg: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;
}
