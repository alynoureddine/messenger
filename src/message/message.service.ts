import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageEntity } from './message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { ChatEntity } from '../chat/chat.entity';
import { UserEntity } from '../users/user.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
  ) {
  }

  create(text: string, chat: ChatEntity, user: UserEntity): Promise<MessageEntity> {
    let message: MessageEntity = new MessageEntity();

    message.text = text;
    message.chat = chat;
    message.user = user;

    return this.messageRepository.save(message);
  }
}
