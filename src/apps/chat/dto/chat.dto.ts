import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserResponseDto } from 'src/apps/user/dto/user.dto';
import { AbstractResponseDto } from 'src/helper/dto.abstract';
import Category from './category.enum';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { AbstractQuery } from 'src/helper/query.abstract';
import { User } from 'src/apps/user/entities/user.entity';
import { Message } from 'src/apps/message/entities/message.entity';

export class ChatDto {
  @ApiProperty({ enum: Category })
  @IsString()
  @IsNotEmpty()
  @IsEnum(Category)
  category: Category;

  @ApiPropertyOptional({ type: () => User })
  @IsOptional()
  user: User;

  @ApiProperty()
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;
}

export class ChatQuery extends AbstractQuery {
  @ApiPropertyOptional({ enum: Category })
  @IsEnum(Category)
  @IsOptional()
  category: Category;
}

export class ChatResponseDto extends AbstractResponseDto {
  @ApiProperty({ enum: Category })
  category: Category;

  @ApiProperty()
  title: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ type: () => User })
  user: User;

  @ApiProperty({ type: () => [Message] })
  message: Message[];
}
