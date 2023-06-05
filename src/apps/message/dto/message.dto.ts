import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserResponseDto } from 'src/apps/user/dto/user.dto';
import { AbstractResponseDto } from 'src/helper/dto.abstract';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { AbstractQuery } from 'src/helper/query.abstract';
import { User } from 'src/apps/user/entities/user.entity';
import { Chat } from 'src/apps/chat/entites/chat.entity';
import { ChatQuery, ChatResponseDto } from 'src/apps/chat/dto/chat.dto';

export class MessageDto {
  @ApiPropertyOptional({ type: () => User })
  @IsOptional()
  user: User;

  @ApiProperty()
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional({ type: () => Chat })
  @IsOptional()
  chat: Chat;

  @ApiProperty()
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  chatId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  originalText: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  alternativeText: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  messageResponse: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  messageResponsePayload: string;
}

export class MessageQuery extends ChatQuery {
  @ApiPropertyOptional()
  @IsUUID()
  @IsString()
  @IsOptional()
  chatId: string;
}

export class MessageResponseDto extends AbstractResponseDto {
  @ApiProperty()
  originalText: string;

  @ApiProperty()
  alternativeText: string;

  @ApiProperty()
  messageResponse: object;

  @ApiPropertyOptional()
  messageResponsePayload: object;

  @ApiProperty()
  userId: string;

  @ApiProperty({ type: () => UserResponseDto })
  user: UserResponseDto;

  @ApiProperty()
  chatId: string;

  @ApiProperty({ type: () => ChatResponseDto })
  chat: ChatResponseDto;
}
