import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  isAlive(): boolean {
    return true;
  }
}
