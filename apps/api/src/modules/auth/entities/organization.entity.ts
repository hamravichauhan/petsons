import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'legal_name', length: 255 })
  legalName: string;

  @Column({ name: 'tax_identifier', length: 100, unique: true })
  taxIdentifier: string;

  @Column({ name: 'tax_identifier_type', length: 20 })
  taxIdentifierType: string;

  @Column({ name: 'business_type', length: 50 })
  businessType: string;

  @Column({ length: 20, default: 'PENDING' })
  tier: string;

  @Column({ name: 'verification_status', length: 20, default: 'PENDING' })
  verificationStatus: string;

  @Column({ name: 'credit_limit', type: 'decimal', precision: 15, scale: 2, default: 0 })
  creditLimit: number;

  @Column({ name: 'payment_terms', length: 20, default: 'PREPAID' })
  paymentTerms: string;

  @Column({ name: 'is_active', default: false })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @VersionColumn()
  version: number;
}