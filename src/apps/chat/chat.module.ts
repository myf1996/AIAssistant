import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRepository } from './entites/chat.repository';
import { MessageRepository } from '../message/entities/message.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRepository, MessageRepository])],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
