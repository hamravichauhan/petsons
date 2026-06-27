import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RfqRequest } from './entities/rfq.entity';
import { RfqItem } from './entities/rfq-item.entity';

interface CreateRfqDto {
  organizationId: string;
  items: { productId: string; packagingUnitId: string; quantity: number; notes?: string }[];
  deliveryFrequency?: string;
  deliveryAddress?: any;
  notes?: string;
}

@Injectable()
export class RfqService {
  constructor(
    @InjectRepository(RfqRequest)
    private rfqRepo: Repository<RfqRequest>,
    @InjectRepository(RfqItem)
    private itemRepo: Repository<RfqItem>,
  ) {}

  async create(dto: CreateRfqDto) {
    const count = await this.rfqRepo.count();
    const rfqNumber = `PAT-RFQ-${String(1000 + count + 1).padStart(4, '0')}`;

    const rfq = this.rfqRepo.create({
      rfqNumber,
      organizationId: dto.organizationId,
      status: 'SUBMITTED',
      deliveryFrequency: dto.deliveryFrequency,
      deliveryAddress: dto.deliveryAddress,
      notes: dto.notes,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    const saved = await this.rfqRepo.save(rfq);

    for (const item of dto.items) {
      const rfqItem = this.itemRepo.create({
        rfqId: saved.id,
        productId: item.productId,
        packagingUnitId: item.packagingUnitId,
        quantity: item.quantity,
        notes: item.notes,
      });
      await this.itemRepo.save(rfqItem);
    }

    const items = await this.itemRepo.find({ where: { rfqId: saved.id } });
    return { ...saved, items };
  }

  async findAll(organizationId: string) {
    return this.rfqRepo.find({
      where: { organizationId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const rfq = await this.rfqRepo.findOne({ where: { id } });
    if (!rfq) throw new NotFoundException('RFQ not found');

    const items = await this.itemRepo.find({ where: { rfqId: id } });

    return { ...rfq, items };
  }

  async updateStatus(id: string, status: string) {
    const rfq = await this.rfqRepo.findOne({ where: { id } });
    if (!rfq) throw new NotFoundException('RFQ not found');

    const validTransitions: Record<string, string[]> = {
      DRAFT: ['SUBMITTED'],
      SUBMITTED: ['UNDER_REVIEW'],
      UNDER_REVIEW: ['PRICED', 'REJECTED'],
      PRICED: ['APPROVED', 'COUNTERED', 'REJECTED', 'EXPIRED'],
      COUNTERED: ['PRICED', 'APPROVED', 'REJECTED'],
      APPROVED: ['CONVERTED_TO_ORDER', 'EXPIRED'],
    };

    const allowed = validTransitions[rfq.status] || [];
    if (!allowed.includes(status)) {
      throw new BadRequestException(
        `Cannot transition from ${rfq.status} to ${status}. Allowed: ${allowed.join(', ')}`,
      );
    }

    rfq.status = status;
    return this.rfqRepo.save(rfq);
  }
}