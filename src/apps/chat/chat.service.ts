import { Injectable, MethodNotAllowedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRepository } from './entites/chat.repository';
import { User } from '../user/entities/user.entity';
import { ChatDto, ChatQuery, ChatResponseDto } from './dto/chat.dto';
import { Chat } from './entites/chat.entity';
import { MessageRepository } from '../message/entities/message.repository';
import {
  MessageDto,
  MessageQuery,
  MessageResponseDto,
} from '../message/dto/message.dto';
import { openAIChat } from './chat.util';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRepository)
    private chatRepository: ChatRepository,

    @InjectRepository(MessageRepository)
    private messageRepository: MessageRepository,
  ) {}

  async createChat(
    user: User,
    query: ChatQuery,
    dto: ChatDto,
  ): Promise<MessageResponseDto> {
    //
    dto.user = user;
    let chat = await this.chatRepository.createChat(dto);
    const openai = await openAIChat(
      user, 
      [], 
      dto.title,
      dto.category,
    );
    let message = await this.messageRepository.createMessage({
      user: dto.user,
      chat,
      originalText: dto.title,
      alternativeText: openai.prompt,
      messageResponse: openai?.response?.choices[0]?.message || {
        role: 'assistant',
        content: '',
      },
      messageResponsePayload: openai.response,
    });
    delete message.messageResponsePayload;
    return message;
  }

  async getAllChat(user: User, query: ChatQuery): Promise<Chat[]> {
    query.userId = user.id;
    return await this.chatRepository.getAllChat(query);
  }

  async getChatbyId(id: string, user: User, query: ChatQuery): Promise<Chat> {
    return await this.chatRepository.getChatbyId(id, query);
  }

  async updateChatbyId(
    id: string,
    user: User,
    query: ChatQuery,
    dto: ChatDto,
  ): Promise<Chat> {
    throw new MethodNotAllowedException();
  }

  async deleteChatbyId(
    id: string,
    user: User,
    query: ChatQuery,
  ): Promise<Chat> {
    return await this.chatRepository.deleteChatbyId(id, query);
  }

  async getMessagebyChatId(
    id: string,
    user: User,
    query: MessageQuery,
  ): Promise<MessageResponseDto[]> {
    await this.getChatbyId(id, user, query);
    return await this.messageRepository.getAllMessage(query);
  }

  async addMessagebyChatId(
    id: string,
    user: User,
    query: MessageQuery,
    dto: MessageDto,
  ): Promise<MessageResponseDto> {
    const chat = await this.getChatbyId(id, user, query);
    query.userId = user.id;
    query.chatId = chat.id;
    let history = [];
    let messages = await this.messageRepository.getAllMessage(query);
    messages.forEach((message) => {
      history.push({
        role: 'user',
        content: message.alternativeText,
      });
      history.push(message.messageResponse);
    });
    dto.user = user;
    dto.chat = chat;
    const openai = await openAIChat(
      user, 
      history, 
      dto.originalText,
      chat.category,
    );
    const message = await this.messageRepository.createMessage({
      ...dto,
      alternativeText: openai.prompt,
      messageResponse: openai?.response?.choices[0]?.message || {
        role: 'assistant',
        content: '',
      },
      messageResponsePayload: openai.response,
    });
    delete message.messageResponsePayload;
    return message;
  }
}
