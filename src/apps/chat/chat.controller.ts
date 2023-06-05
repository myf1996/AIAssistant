import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  ChatResponseDto,
  ChatDto,
  ChatQuery,
} from 'src/apps/chat/dto/chat.dto';
import { ChatService } from './chat.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/apps/user/entities/user.entity';
import { MessageDto, MessageQuery } from '../message/dto/message.dto';

@ApiTags('Auth/User Module')
@Controller('chat')
@UsePipes(ValidationPipe)
@UseGuards(AuthGuard('jwt'))
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiBadRequestResponse({ description: 'BadRequest.' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post()
  @ApiResponse({ status: 200, type: ChatResponseDto })
  async createChat(
    @GetUser() user: User,
    @Query() query: ChatQuery,
    @Body() dto: ChatDto,
  ) {
    return await this.chatService.createChat(user, query, dto);
  }

  @Get()
  @ApiResponse({ status: 200, type: [ChatResponseDto] })
  async getAllChat(@GetUser() user: User, @Query() query: ChatQuery) {
    return await this.chatService.getAllChat(user, query);
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: ChatResponseDto })
  async getChatbyId(
    @Param('id') id: string,
    @GetUser() user: User,
    @Query() query: ChatQuery,
  ) {
    return await this.chatService.getChatbyId(id, user, query);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, type: ChatResponseDto })
  async updateChatbyId(
    @Param('id') id: string,
    @GetUser() user: User,
    @Query() query: ChatQuery,
    @Body() dto: ChatDto,
  ) {
    return await this.chatService.updateChatbyId(id, user, query, dto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, type: ChatResponseDto })
  async deleteChatbyId(
    @Param('id') id: string,
    @GetUser() user: User,
    @Query() query: ChatQuery,
  ) {
    return await this.chatService.deleteChatbyId(id, user, query);
  }

  @Post(':id/message')
  @ApiResponse({ status: 200, type: ChatResponseDto })
  async addMessagebyChatId(
    @Param('id') id: string,
    @GetUser() user: User,
    @Query() query: MessageQuery,
    @Body() dto: MessageDto,
  ) {
    return await this.chatService.addMessagebyChatId(id, user, query, dto);
  }

  @Get(':id/message')
  @ApiResponse({ status: 200, type: ChatResponseDto })
  async getMessagebyChatId(
    @Param('id') id: string,
    @GetUser() user: User,
    @Query() query: MessageQuery,
  ) {
    return await this.chatService.getMessagebyChatId(id, user, query);
  }
}
