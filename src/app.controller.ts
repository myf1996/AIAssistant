import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Health Module')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  health(): string {
    return this.appService.health();
  }
}
