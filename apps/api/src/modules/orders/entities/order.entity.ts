import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, VersionColumn } from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_number', type: 'varchar', length: 50, unique: true })
  orderNumber: string;

  @Column({ name: 'organization_id', type: 'uuid' })
  organizationId: string;

  @Column({ type: 'varchar', length: 30, default: 'DRAFT' })
  status: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  subtotal: number;

  @Column({ name: 'discount_total', type: 'decimal', precision: 15, scale: 2, default: 0 })
  discountTotal: number;

  @Column({ name: 'shipping_total', type: 'decimal', precision: 15, scale: 2, default: 0 })
  shippingTotal: number;

  @Column({ name: 'tax_total', type: 'decimal', precision: 15, scale: 2, default: 0 })
  taxTotal: number;

  @Column({ name: 'grand_total', type: 'decimal', precision: 15, scale: 2, default: 0 })
  grandTotal: number;

  @Column({ type: 'char', length: 3, default: 'USD' })
  currency: string;

  @Column({ name: 'po_number', type: 'varchar', length: 100, nullable: true })
  poNumber: string;

  @Column({ name: 'shipping_address', type: 'jsonb' })
  shippingAddress: any;

  @Column({ name: 'billing_address', type: 'jsonb' })
  billingAddress: any;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @VersionColumn()
  version: number;
}