import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

  public findOne(id: number): Promise<ChatEntity> {
    return this.chatRepository.findOne({ id });
  }

  public async create(userId: number, friendId: number): Promise<ChatEntity> {
    let chat: ChatEntity = new ChatEntity();

    const user: UserEntity = await this.userService.findOne(userId);

    if (!user) {
      throw new BadRequestException(['User is not valid.']);
    }

    const friend: UserEntity = await this.userService.getFriend(userId, friendId);

    if (!friend) {
      throw new BadRequestException(['Friend ID is not valid.']);
    }

    if (await this.getChat(userId, friendId)) {
      throw new BadRequestException(['Chat already exists']);
    }

    chat.users = [user, friend];

    return this.chatRepository.save(chat);
  }

  public getChatList(userId: number): Promise<ChatEntity[]> {
    return this.chatRepository.createQueryBuilder('chat')
      .leftJoinAndSelect('chat.users', 'currentUser')
      .leftJoinAndSelect('chat.users', 'user')
      .where('currentUser.id = :userId', {userId})
      .getMany();
  }

  public getChat(userId: number, friendId: number) {
    return this.chatRepository.createQueryBuilder('chat')
      .leftJoinAndSelect('chat.users', 'currentUser')
      .leftJoinAndSelect('chat.users', 'user')
      .where('currentUser.id = :userId', {userId})
      .andWhere('user.id = :friendId', {friendId})
      .getOne();
  }

  public getChatById(id: number, userId): Promise<ChatEntity> {
    return this.chatRepository.findOne(
      { id: id },
      { relations: ['users', 'messages', 'messages.user'] },
    );
  }
}
