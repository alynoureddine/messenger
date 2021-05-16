import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ChatEntity } from '../chat/chat.entity';
import { UserEntity } from '../users/user.entity';

@Entity()
export class MessageEntity {

  @PrimaryGeneratedColumn()
  public id!: number;

  @ManyToOne(type => ChatEntity, chat => chat.messages)
  chat: ChatEntity;

  @Column('text', { nullable: false })
  text: string;

  @ManyToOne(type => UserEntity, user => user.messages)
  user: UserEntity;

  @CreateDateColumn()
  date: string;
}
