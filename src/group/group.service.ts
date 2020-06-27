import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupEntity } from './group.entity';
import { UserService } from '../users/user.service';
import { UserEntity } from '../users/user.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,
    private readonly userService: UserService,
  ) {}

  async create(userId: number, friendIds: number[]): Promise<GroupEntity> {
    let group: GroupEntity = new GroupEntity();

    const user: UserEntity = await this.userService.findOne(userId);

    if (!user) {
      const errors = {user: 'User is not valid.'};
      throw new HttpException({message: 'Group creation failed', errors}, HttpStatus.BAD_REQUEST);
    }

    const friends: UserEntity[] = await Promise.all(friendIds.map((friendId) =>
      this.userService.getFriend(userId, friendId)
    ));

    if (friends.length < 1) {
      const errors = {friendId: 'Please enter a valid friend IDs'};
      throw new HttpException({message: 'Input data validation failed', errors}, HttpStatus.BAD_REQUEST);
    }

    group.users = [user, ...friends];

    return this.groupRepository.save(group);
  }

  getGroupList(userId: number): Promise<GroupEntity[]> {
    //left join on users twice to load all other users into the group entity, then exclude the current user
    return this.groupRepository.createQueryBuilder('group')
      .leftJoin('group.users', 'currentUser')
      .where('currentUser.id = :userId', {userId})
      .leftJoinAndSelect('group.users', 'user')
      .where('user.id != :userId', {userId})
      .getMany();
  }
}
