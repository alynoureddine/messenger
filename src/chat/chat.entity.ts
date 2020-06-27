import { Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { MessageEntity } from '../message/message.entity';

@Entity()
export class ChatEntity {

  @PrimaryGeneratedColumn()
  public id!: number;

  @ManyToMany(type => UserEntity, user => user.chats)
  @JoinTable()
  users: UserEntity[];

  @OneToMany(type => MessageEntity, message => message.chat)
  messages: MessageEntity[];
}
