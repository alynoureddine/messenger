import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsEmail } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { FriendRequestEntity } from '../friend-request/friend-request.entity';
import { ChatEntity } from '../chat/chat.entity';
import { MessageEntity } from '../message/message.entity';

@Entity('user')
export class UserEntity {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  username: string;

  @Column()
  // @IsEmail()
  email: string;

  @Column({default: ''})
  bio: string;

  @Column({default: ''})
  image: string;

  @Column()
  @Exclude()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @ManyToMany(type => UserEntity, user => user)
  @JoinTable()
  friends: UserEntity[];

  @OneToMany(type => FriendRequestEntity, friend => friend.requester)
  friendRequests: FriendRequestEntity[];

  @ManyToMany(type => ChatEntity, chat => chat.users)
  @JoinTable()
  chats: ChatEntity[];

  @OneToMany(type => MessageEntity, message => message.user)
  messages: MessageEntity[];

  @CreateDateColumn()
  createDate: Date;
}
