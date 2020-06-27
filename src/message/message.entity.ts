import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ChatEntity } from '../chat/chat.entity';

@Entity()
export class MessageEntity {

  @PrimaryGeneratedColumn()
  public id!: number;

  @ManyToOne(type => ChatEntity, chat => chat.messages)
  chat: ChatEntity;

  @Column('text', { nullable: false })
  text: string;

  @CreateDateColumn()
  date: string;
}
