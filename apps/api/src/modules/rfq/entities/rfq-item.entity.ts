import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { RfqRequest } from './rfq.entity';

@Entity('rfq_items')
export class RfqItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => RfqRequest)
  @JoinColumn({ name: 'rfq_id' })
  rfq: RfqRequest;

  @Column({ name: 'rfq_id', type: 'uuid' })
  rfqId: string;

  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  @Column({ name: 'packaging_unit_id', type: 'uuid' })
  packagingUnitId: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'quoted_unit_price', type: 'decimal', precision: 15, scale: 4, nullable: true })
  quotedUnitPrice: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
