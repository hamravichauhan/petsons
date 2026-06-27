import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../catalog/entities/product.entity';
import { PackagingUnit } from '../catalog/entities/packaging-unit.entity';

interface CreateOrderDto {
  organizationId: string;
  items: { productId: string; packagingUnitId: string; quantity: number }[];
  shippingAddress: any;
  billingAddress: any;
  poNumber?: string;
  notes?: string;
}

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private itemRepo: Repository<OrderItem>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(PackagingUnit) private packagingRepo: Repository<PackagingUnit>,
  ) {}

  async create(dto: CreateOrderDto) {
    const count = await this.orderRepo.count();
    const orderNumber = `PAT-ORD-${String(1000 + count + 1).padStart(4, '0')}`;

    let subtotal = 0;

    // Calculate totals
    const orderItems = [];
    for (const item of dto.items) {
      const product = await this.productRepo.findOne({ where: { id: item.productId } });
      if (!product) throw new NotFoundException(`Product ${item.productId} not found`);

      const packaging = await this.packagingRepo.findOne({ where: { id: item.packagingUnitId } });
      if (!packaging) throw new NotFoundException(`Packaging ${item.packagingUnitId} not found`);

      const unitPrice = Number(product.baseMsrp);
      const totalPrice = unitPrice * item.quantity;
      subtotal += totalPrice;

      orderItems.push({
        productId: product.id,
        packagingUnitId: packaging.id,
        productName: product.name,
        sku: product.sku,
        quantity: item.quantity,
        unitPrice,
        totalPrice,
      });
    }

    // Simple tax calculation (8%)
    const taxTotal = Math.round(subtotal * 0.08 * 100) / 100;
    const grandTotal = subtotal + taxTotal;

    // Create order
    const order = this.orderRepo.create({
      orderNumber,
      organizationId: dto.organizationId,
      status: 'CONFIRMED',
      subtotal,
      taxTotal,
      grandTotal,
      shippingAddress: dto.shippingAddress,
      billingAddress: dto.billingAddress,
      poNumber: dto.poNumber,
      notes: dto.notes,
    });

    const saved = await this.orderRepo.save(order);

    // Create order items
    for (const item of orderItems) {
      await this.itemRepo.save({
        orderId: saved.id,
        ...item,
      });
    }

    const items = await this.itemRepo.find({ where: { orderId: saved.id } });
    return { ...saved, items };
  }

  async findAll(organizationId: string) {
    return this.orderRepo.find({
      where: { organizationId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    const items = await this.itemRepo.find({ where: { orderId: id } });
    return { ...order, items };
  }

  async updateStatus(id: string, status: string) {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    const validTransitions: Record<string, string[]> = {
      DRAFT: ['PENDING_PAYMENT', 'CANCELLED'],
      PENDING_PAYMENT: ['CONFIRMED', 'CANCELLED'],
      CONFIRMED: ['PROCESSING', 'CANCELLED'],
      PROCESSING: ['SHIPPED', 'CANCELLED'],
      SHIPPED: ['OUT_FOR_DELIVERY', 'DELIVERED'],
      OUT_FOR_DELIVERY: ['DELIVERED'],
      DELIVERED: ['RETURNED'],
    };

    const allowed = validTransitions[order.status] || [];
    if (!allowed.includes(status)) {
      throw new BadRequestException(`Cannot transition from ${order.status} to ${status}`);
    }

    order.status = status;
    return this.orderRepo.save(order);
  }
}