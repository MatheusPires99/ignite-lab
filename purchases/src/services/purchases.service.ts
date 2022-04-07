import { Injectable } from '@nestjs/common';

import { PrismaService } from '../database/prisma/prisma.service';

type CreatePurchaseParams = {
  productId: string;
  customerId: string;
};

@Injectable()
export class PurchasesService {
  constructor(private prisma: PrismaService) {}

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

    return this.prisma.purchase.create({
      data: {
        productId,
        customerId,
      },
    });
  }
}
