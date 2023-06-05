import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import OrderBy from './order.enum';
import SortBy from './sort.enum';

export class AbstractQuery {
  @ApiPropertyOptional()
  @IsNumberString()
  @IsOptional()
  take: string;

  @ApiPropertyOptional()
  @IsNumberString()
  @IsOptional()
  skip: string;

  @ApiPropertyOptional({ enum: OrderBy })
  @IsString()
  @IsEnum(OrderBy)
  @IsOptional()
  order: OrderBy;

  @ApiPropertyOptional({ enum: SortBy })
  @IsString()
  @IsEnum(SortBy)
  @IsOptional()
  sort: SortBy;

  @ApiPropertyOptional()
  @IsUUID()
  @IsString()
  @IsOptional()
  userId: string;
}
