import { AbstractBaseEntity } from 'src/helper/entity.abstract';
import { Column, Entity, OneToMany, Unique } from 'typeorm';
import Role from '../dto/role.enum';
import Status from '../dto/status.enum';
import { Chat } from 'src/apps/chat/entites/chat.entity';
import { Message } from 'src/apps/message/entities/message.entity';
import Gender from '../dto/gender.enum';

@Entity()
@Unique(['email'])
export class User extends AbstractBaseEntity {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({
    nullable: true,
    enum: Gender,
  })
  gender: Gender;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  salt: string;

  @Column({ nullable: true })
  emailVerifyHash: string;

  @Column({ nullable: true })
  lastseen: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.TEACHER,
  })
  role: Role;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.PENDING,
  })
  status: Status;

  @OneToMany(() => Chat, (chat) => chat.user)
  chat: Chat[];

  @OneToMany(() => Message, (message) => message.chat)
  message: Message[];
}
