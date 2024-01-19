import { Injectable } from '@nestjs/common';

import { LLMAgent } from './agent/types';
import { createOrderAgent } from './agent/order-agent';
import { BasketService } from 'src/basket/basket.service';
import { ProductsService } from 'src/products/products.service';
import { OrderService } from 'src/order/order.service';

@Injectable()
export class OrderAgentService {
  private agentsForUser = new Map<string, LLMAgent>();

  constructor(
    private readonly productsService: ProductsService,
    private readonly basketService: BasketService,
    private readonly orderService: OrderService,
  ) {}

  async chat(prompt: string, user: string) {
    return (await this.getAgentForUser(user)).chat(prompt);
  }

  private async getAgentForUser(user: string): Promise<LLMAgent> {
    if (!this.agentsForUser.has(user)) {
      this.agentsForUser.set(
        user,
        await createOrderAgent(
          this.productsService,
          this.basketService,
          this.orderService,
          user,
        ),
      );
    }

    return this.agentsForUser.get(user);
  }
}
