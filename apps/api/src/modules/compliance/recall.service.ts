import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@Injectable()
export class RecallService {
  constructor(
    @InjectEntityManager() private entityManager: EntityManager,
  ) {}

  async traceBatch(batchLotNumber: string) {
    const result = await this.entityManager.query(`
      SELECT 
        o.order_number,
        o.status,
        o.created_at as order_date,
        org.legal_name as customer_name,
        org.tier,
        oi.product_name,
        oi.quantity,
        oa.lot_number,
        pb.expiration_date
      FROM product_batches pb
      JOIN order_allocations oa ON oa.lot_number = pb.lot_number
      JOIN orders o ON o.id = oa.order_id
      JOIN organizations org ON org.id = o.organization_id
      JOIN order_items oi ON oi.id = oa.order_item_id
      WHERE pb.lot_number = $1
      ORDER BY o.created_at DESC
    `, [batchLotNumber]);

    const customers = result.map((r: any) => r.customer_name);
    const affectedCustomers = [...new Set(customers)];

    return {
      batchLotNumber,
      totalShipments: result.length,
      affectedCustomers: affectedCustomers.length,
      customers: affectedCustomers,
      shipments: result,
      recallStatus: 'TRACE_COMPLETE',
    };
  }

  async initiateRecall(batchLotNumber: string, reason: string, classification: string) {
    await this.entityManager.query(
      `UPDATE product_batches SET recall_status = $1 WHERE lot_number = $2`,
      [classification, batchLotNumber]
    );

    const trace = await this.traceBatch(batchLotNumber);

    await this.entityManager.query(
      `INSERT INTO recall_events (id, recall_number, classification, reason, affected_lots, status)
       VALUES (gen_random_uuid(), 'RECALL-' || floor(extract(epoch from now())), $1, $2, $3, 'INITIATED')`,
      [classification, reason, JSON.stringify([batchLotNumber])]
    );

    return {
      ...trace,
      reason,
      classification,
      message: `Recall initiated. ${trace.affectedCustomers} customers need to be notified.`,
    };
  }
}
