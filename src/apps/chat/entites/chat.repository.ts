import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Chat } from './chat.entity';
import { systemConfig } from 'src/config/system.config';

@EntityRepository(Chat)
export class ChatRepository extends Repository<Chat> {
  async createChat(dto) {
    let chat = this.create();
    chat.user = dto.user;
    chat.category = dto.category;
    chat.title = dto.title;
    try {
      return await chat.save();
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAllChat(query) {
    let qs = this.createQueryBuilder('chat');
    if (systemConfig.database.fetch_data_with_deleted) {
      qs = qs.withDeleted();
    }
    if (query.userId) {
      qs = qs.andWhere('chat.userId =:userId', {
        userId: `${query.userId}`,
      });
    }
    if (query.category) {
      qs = qs.andWhere('chat.category =:category', {
        category: `${query.category}`,
      });
    }
    if (query.title) {
      qs = qs.andWhere('chat.title ILIKE :title', {
        title: `%${query.title}%`,
      });
    }
    return await qs
      .leftJoinAndSelect('chat.user', 'user')
      .orderBy(`chat.${query.order || 'createdAt'}`, query.sort || 'DESC')
      .skip(query.skip || 0)
      .take(query.take || 20)
      .getMany();
  }

  async getChatbyId(id, query) {
    let qs = this.createQueryBuilder('chat');
    qs = qs.andWhere('chat.id =:id', {
      id: id,
    });

    if (systemConfig.database.fetch_data_with_deleted) {
      qs = qs.withDeleted();
    }
    let result = await qs.getOne();
    if (result) {
      return result;
    }
    throw new NotFoundException('Chat Not Found');
  }

  async updateChatbyId(id, query, dto) {
    let chat = await this.getChatbyId(id, query);
    chat.user = dto.user;
    chat.category = dto.category;
    chat.title = dto.title;
    // chat.alternativeText = dto.alternativeText;
    // chat.chatResponse = dto.chatResponse;
    try {
      return await chat.save();
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteChatbyId(id, query) {
    let chat = await this.getChatbyId(id, query);
    await this.softDelete(id);
    return chat;
  }
}
