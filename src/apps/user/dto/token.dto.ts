import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class TokenDto {
  @ApiProperty()
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
