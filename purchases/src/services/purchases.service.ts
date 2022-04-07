import { Injectable } from '@nestjs/common';

import { NEW_PURCHASE_TOPIC } from '../constants/kafka-topics';
import { PrismaService } from '../database/prisma/prisma.service';
import { KafkaService } from '../messaging/kaftka.service';

type CreatePurchaseParams = {
  productId: string;
  customerId: string;
};

@Injectable()
export class PurchasesService {
  constructor(private prisma: PrismaService, private kafka: KafkaService) {}

  async getAllPurchases() {
    return this.prisma.purchase.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getAllPurchasesFromCustomer(customerId: string) {
    return this.prisma.purchase.findMany({
      where: {
        customerId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async createPurchase({ productId, customerId }: CreatePurchaseParams) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return new Error('Product not found.');
    }

    const purchase = await this.prisma.purchase.create({
      data: {
        productId,
        customerId,
      },
    });

    const customer = await this.prisma.customer.findUnique({
      where: {
        id: customerId,
      },
    });

    this.kafka.emit(NEW_PURCHASE_TOPIC, {
      customer: {
        authUserId: customer.authUserId,
      },
      product: {
        id: product.id,
        title: product.title,
        slug: product.slug,
      },
    });

    return purchase;
  }
}
