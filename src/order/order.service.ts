import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-service/prisma-service.service';
import { sum, sumByField } from 'src/util/utils';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async orders(user: string) {
    const orders = await this.prisma.order.findMany({
      where: { user: user },
      include: { products: true },
    });

    return {
      orders,
      total: sum(orders.map((order) => sumByField(order.products, 'price'))),
    };
  }

  async createOrder(user: string) {
    const basket = await this.prisma.basket.findUnique({
      where: { id: user },
      include: { products: true },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [order, _basket] = await this.prisma.$transaction([
      this.prisma.order.create({
        data: {
          user: user,
          products: { connect: basket.products },
        },
        include: { products: true },
      }),
      this.prisma.basket.delete({
        where: { id: user },
      }),
    ]);

    return {
      ...order,
      total: sumByField(order.products, 'price'),
    };
  }
}
