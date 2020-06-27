import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatEntity } from './chat.entity';
import { UserService } from '../users/user.service';
import { UserEntity } from '../users/user.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatEntity)
    private readonly chatRepository: Repository<ChatEntity>,
    private readonly userService: UserService,
  ) {}

  async create(userId: number, friendId: number): Promise<ChatEntity> {
    let chat: ChatEntity = new ChatEntity();

    const user: UserEntity = await this.userService.findOne(userId);

    if (!user) {
      const errors = {user: 'User is not valid.'};
      throw new HttpException({message: 'Chat creation failed', errors}, HttpStatus.BAD_REQUEST);
    }

    const friend: UserEntity = await this.userService.getFriend(userId, friendId);

    if (!friend) {
      const errors = {friendId: 'Please enter a valid friend ID'};
      throw new HttpException({message: 'Input data validation failed', errors}, HttpStatus.BAD_REQUEST);
    }

    chat.users = [user, friend];

    return this.chatRepository.save(chat);
  }

  getChatList(userId: number): Promise<ChatEntity[]> {
    //left join on users twice to load the friend into the chat entity, then exclude the current user
    return this.chatRepository.createQueryBuilder('chat')
      .leftJoin('chat.users', 'currentUser')
      .where('currentUser.id = :userId', {userId})
      .leftJoinAndSelect('chat.users', 'user')
      .where('user.id != :userId', {userId})
      .getMany();
  }
}
