import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { OrderAgentService } from 'src/order-agent/order-agent.service';

export class ChatDTO {
  input: string;
}

@Controller('chat')
export class ChatController {
  constructor(private readonly orderAgentService: OrderAgentService) {}

  @Post()
  async chat(
    @Body() body: ChatDTO,
    @Request() request: Request,
  ): Promise<string> {
    const user = request.headers['x-user'];
    if (user === undefined) {
      throw new HttpException(
        `Missing required header: X-User`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.orderAgentService.chat(body.input, user);
  }
}
