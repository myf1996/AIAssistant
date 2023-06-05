import { ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from './role.enum';

export class ChatHistory {
  @ApiPropertyOptional({ enum: Role })
  role: Role;

  @ApiPropertyOptional()
  content: string;
}
