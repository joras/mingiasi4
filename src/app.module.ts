import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsController } from './products/products.controller';
import { ChatController } from './chat/chat.controller';
import { PrismaService } from './prisma-service/prisma-service.service';
import { ProductsService } from './products/products.service';
import { OrderAgentService } from './order-agent/order-agent.service';
import { BasketService } from './basket/basket.service';
import { OrderService } from './order/order.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'web', 'dist'),
      exclude: ['/api/(.*)'],
    }),
  ],
  controllers: [AppController, ProductsController, ChatController],
  providers: [
    AppService,
    PrismaService,
    ProductsService,
    OrderAgentService,
    BasketService,
    OrderService,
  ],
})
export class AppModule {}
