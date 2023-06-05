import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Message } from './message.entity';
import { systemConfig } from 'src/config/system.config';

@EntityRepository(Message)
export class MessageRepository extends Repository<Message> {
  async createMessage(dto) {
    let message = this.create();
    message.user = dto.user;
    message.chat = dto.chat;
    message.originalText = dto.originalText;
    message.alternativeText = dto.alternativeText;
    message.messageResponse = dto.messageResponse;
    message.messageResponsePayload = dto.messageResponsePayload;
    try {
      return await message.save();
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAllMessage(query) {
    let qs = this.createQueryBuilder('message');
    if (systemConfig.database.fetch_data_with_deleted) {
      qs = qs.withDeleted();
    }
    if (query.userId) {
      qs = qs.andWhere('message.userId =:userId', {
        userId: `${query.userId}`,
      });
    }
    if (query.chatId) {
      qs = qs.andWhere('message.chatId =:chatId', {
        chatId: `${query.chatId}`,
      });
    }
    if (query.originalText) {
      qs = qs.andWhere('message.originalText ILIKE :originalText', {
        originalText: `%${query.originalText}%`,
      });
    }
    return await qs
      .leftJoinAndSelect('message.user', 'user')
      .leftJoinAndSelect('message.chat', 'chat')
      .orderBy(`message.${query.order || 'createdAt'}`, query.sort || 'ASC')
      .skip(query.skip || 0)
      .take(query.take || 20)
      .getMany();
  }

  async getMessagebyId(id, query) {
    let qs = this.createQueryBuilder('message');
    qs = qs.andWhere('message.id =:id', {
      id: id,
    });

    if (systemConfig.database.fetch_data_with_deleted) {
      qs = qs.withDeleted();
    }
    let result = await qs.getOne();
    if (result) {
      return result;
    }
    throw new NotFoundException('message Not Found');
  }

  async updateMessagebyId(id, query, dto) {
    let message = await this.getMessagebyId(id, query);
    message.user = dto.user;
    message.originalText = dto.originalText;
    message.alternativeText = dto.alternativeText;
    message.messageResponse = dto.messageResponse;
    message.messageResponsePayload = dto.messageResponsePayload;
    try {
      return await message.save();
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteMessagebyId(id, query) {
    let message = await this.getMessagebyId(id, query);
    await this.softDelete(id);
    return message;
  }
}
