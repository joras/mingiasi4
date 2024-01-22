import { createOpenAIToolsAgent, AgentExecutor } from 'langchain/agents';
import { env } from 'process';

import { ChatOpenAI } from '@langchain/openai';
import { DynamicTool, DynamicStructuredTool } from '@langchain/core/tools';
import { BufferWindowMemory } from 'langchain/memory';

import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';

import { z } from 'zod';
import { ProductsService } from 'src/products/products.service';
import { BasketService } from 'src/basket/basket.service';
import { Logger } from '@nestjs/common';
import { LLMAgent } from './types';
import { OrderService } from 'src/order/order.service';

export async function createOrderAgent(
  productService: ProductsService,
  basketService: BasketService,
  orderService: OrderService,
  user: string,
): Promise<LLMAgent> {
  const logger = new Logger(`OrderAgent[${user}]`);

  const model = new ChatOpenAI({
    //modelName: 'gpt-3.5-turbo-1106',
    modelName: 'gpt-4-1106-preview',
    temperature: 0,
    openAIApiKey: env.OPENAI_API_KEY,
  });

  const tools = [
    new DynamicStructuredTool({
      name: 'find_product_by_description',
      description: 'finds a product description',
      schema: z.object({
        description: z
          .string()
          .describe(
            'description of the product for postgres fulltext search: size color name',
          ),
      }),
      func: async ({ description }) => {
        logger.log(`calling find_product_by_description("${description}")`);
        try {
          const result = await productService.productByDescription(description);

          if (result === undefined) {
            return 'could not find a product';
          }

          return JSON.stringify(result);
        } catch (e) {
          logger.error(e);
        }
      },
    }),
    new DynamicStructuredTool({
      name: 'add_to_basket',
      description: 'add product to basket and return contents of the basket',
      schema: z.object({
        id: z.string().describe('id of the product '),
      }),
      func: async ({ id }) => {
        logger.log(`calling add_to_basket("${id}")`);
        try {
          const result = await basketService.addProductToBasket(user, id);
          return JSON.stringify(result);
        } catch (e) {
          logger.error(e);
        }
      },
    }),
    new DynamicTool({
      name: 'products_in_basket',
      description: 'list contents of the basket',
      func: async () => {
        try {
          logger.log(`calling products_in_basket()`);
          const result = await basketService.basket(user);
          return JSON.stringify(result);
        } catch (e) {
          logger.error(e);
        }
      },
    }),

    new DynamicTool({
      name: 'list_all_orders',
      description: 'list all orders',
      func: async () => {
        try {
          logger.log(`calling list_all_orders()`);
          const result = await orderService.orders(user);
          return JSON.stringify(result);
        } catch (e) {
          logger.error(e);
        }
      },
    }),
    new DynamicTool({
      name: 'create_order',
      description: 'create an order',
      func: async () => {
        try {
          logger.log(`calling create_order()`);
          const result = await orderService.createOrder(user);
          return JSON.stringify(result);
        } catch (e) {
          logger.error(e);
        }
      },
    }),
  ];

  const prompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      `You are online sales agent, you can find products, add products to basket, show basket contents, and create orders from basket.

      Ask confirmation before adding products to basket. A product can only be added to basket and order can only be created from a basket.

      always return item id
      
      return well formed Markdown
      `,
    ],
    new MessagesPlaceholder('chat_history'),
    ['human', '{input}'],
    new MessagesPlaceholder('agent_scratchpad'),
  ]);

  const runnableAgent = await createOpenAIToolsAgent({
    llm: model,
    tools,
    prompt,
  });

  const executor = new AgentExecutor({
    agent: runnableAgent,
    tools,
    memory: new BufferWindowMemory({
      k: 5,
      returnMessages: true,
      memoryKey: 'chat_history',
      inputKey: 'input',
      outputKey: 'output',
    }),
  });

  return {
    async chat(prompt: string) {
      const result = await executor.invoke({
        input: prompt,
      });

      return result.output;
    },
  };
}
