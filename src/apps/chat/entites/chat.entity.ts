import { AbstractBaseEntity } from 'src/helper/entity.abstract';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import Category from '../dto/category.enum';
import { User } from 'src/apps/user/entities/user.entity';
import { Message } from 'src/apps/message/entities/message.entity';

@Entity()
export class Chat extends AbstractBaseEntity {
  @ManyToOne(() => User, (user) => user.chat, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  user: User;

  @Column({ nullable: true })
  userId: string;

  @Column({
    type: 'enum',
    enum: Category,
    nullable: true,
  })
  category: Category;

  @Column()
  title: string;

  @OneToMany(() => Message, (message) => message.chat)
  message: Message[];

  // @Column()
  // alternativeText: string;

  // @Column()
  // chatResponse: string;
}
