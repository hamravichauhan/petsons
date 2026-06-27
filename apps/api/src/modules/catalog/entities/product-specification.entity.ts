import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('product_specifications')
export class ProductSpecification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  @Column({ name: 'dilution_ratio', type: 'varchar', length: 20, nullable: true })
  dilutionRatio: string;

  @Column({ name: 'brix_value', type: 'decimal', precision: 5, scale: 2, nullable: true })
  brixValue: number;

  @Column({ name: 'ph_level', type: 'decimal', precision: 3, scale: 1, nullable: true })
  phLevel: number;

  @Column({ name: 'shelf_life_days', type: 'int', nullable: true })
  shelfLifeDays: number;

  @Column({ name: 'is_kosher', type: 'boolean', default: false })
  isKosher: boolean;

  @Column({ name: 'is_halal', type: 'boolean', default: false })
  isHalal: boolean;

  @Column({ name: 'is_vegan', type: 'boolean', default: false })
  isVegan: boolean;

  @Column({ name: 'is_gluten_free', type: 'boolean', default: false })
  isGlutenFree: boolean;

  @Column({ name: 'is_organic', type: 'boolean', default: false })
  isOrganic: boolean;
}