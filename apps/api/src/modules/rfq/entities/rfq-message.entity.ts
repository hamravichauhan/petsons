import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { RfqRequest } from './rfq.entity';

@Entity('rfq_messages')
export class RfqMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => RfqRequest)
  @JoinColumn({ name: 'rfq_id' })
  rfq: RfqRequest;

  @Column({ name: 'rfq_id', type: 'uuid' })
  rfqId: string;

  @Column({ name: 'sender_id', type: 'uuid' })
  senderId: string;

  @Column({ name: 'sender_role', type: 'varchar', length: 20 })
  senderRole: string;

  @Column({ type: 'text' })
  message: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}