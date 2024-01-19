import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-service/prisma-service.service';
import { sumByField } from 'src/util/utils';

@Injectable()
export class BasketService {
  constructor(private prisma: PrismaService) {}

  async basket(user: string) {
    const basket = await this.prisma.basket.findUnique({
      where: { id: user },
      include: { products: true },
    });

    return {
      ...basket,
      total: sumByField(basket.products, 'price'),
    };
  }

  async addProductToBasket(user: string, productId: string) {
    const data = {
      id: user,
      user: user,
      products: { connect: [{ id: productId }] },
    };

    const basket = await this.prisma.basket.upsert({
      create: data,
      update: data,
      where: { id: user },
      include: { products: true },
    });

    return {
      ...basket,
      total: sumByField(basket.products, 'price'),
    };
  }
}
