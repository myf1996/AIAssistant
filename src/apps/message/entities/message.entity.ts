import { AbstractBaseEntity } from 'src/helper/entity.abstract';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from 'src/apps/user/entities/user.entity';
import { Chat } from 'src/apps/chat/entites/chat.entity';

@Entity()
export class Message extends AbstractBaseEntity {
  @ManyToOne(() => User, (user) => user.chat, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  user: User;

  @Column({ nullable: true })
  userId: string;

  @ManyToOne(() => Chat, (chat) => chat.message, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  chat: Chat;

  @Column({ nullable: true })
  chatId: string;

  @Column()
  originalText: string;

  @Column({ nullable: true })
  alternativeText: string;

  @Column('jsonb', { default: {} })
  messageResponse: object;

  @Column('jsonb', { default: {} })
  messageResponsePayload: object;
}
