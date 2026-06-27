import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

@Entity('rfq_requests')
export class RfqRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'rfq_number', type: 'varchar', length: 50, unique: true })
  rfqNumber: string;

  @Column({ name: 'organization_id', type: 'uuid' })
  organizationId: string;

  @Column({ type: 'varchar', length: 30, default: 'DRAFT' })
  status: string;

  @Column({ name: 'delivery_frequency', type: 'varchar', length: 20, nullable: true })
  deliveryFrequency: string;

  @Column({ name: 'delivery_address', type: 'jsonb', nullable: true })
  deliveryAddress: any;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'assigned_tier', type: 'varchar', length: 20, nullable: true })
  assignedTier: string;

  @Column({ name: 'expires_at', type: 'timestamptz', nullable: true })
  expiresAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @VersionColumn()
  version: number;
}