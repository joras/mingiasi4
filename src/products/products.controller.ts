import { Controller, Get } from '@nestjs/common';

import { Product } from '@prisma/client';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async products(): Promise<Product[]> {
    return this.productsService.products({});
  }
}
