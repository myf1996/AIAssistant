import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  health(): string {
    return 'OpenAI Teacher Assistant API working healthy.';
  }
}
