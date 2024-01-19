import { Injectable } from '@nestjs/common';
import { Prisma, Product } from '@prisma/client';
import { PrismaService } from 'src/prisma-service/prisma-service.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async products(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ProductWhereUniqueInput;
    where?: Prisma.ProductWhereInput;
    orderBy?: Prisma.ProductOrderByWithAggregationInput;
  }): Promise<Product[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.product.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async productByDescription(query): Promise<Product> {
    const productsResult = await this.prisma.$queryRaw<
      { id: string }[]
    >`SELECT m."id",
        ts_rank(to_tsvector('english', size || ' ' || color || ' ' || name), websearch_to_tsquery('english', ${query})) AS rank
      FROM "public"."Product" as m
      WHERE
        to_tsvector('english', size || ' ' || color || ' ' || name) @@ websearch_to_tsquery('english', ${query})
      ORDER BY rank DESC
      LIMIT 1;`;

    if (productsResult.length === 1) {
      return await this.prisma.product.findUnique({
        where: { id: productsResult[0].id },
      });
    }
  }
}
