import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
      throw new BadRequestException(['User is not valid.'])
    }

    const friends: UserEntity[] = await Promise.all(friendIds.map((friendId) =>
      this.userService.getFriend(userId, friendId)
    ));

    if (friends.length < 1) {
      throw new BadRequestException(['friend IDs are not valid.'])
    }

    group.users = [user, ...friends];

    return this.groupRepository.save(group);
  }

  getGroupList(userId: number): Promise<GroupEntity[]> {
    //left join on users twice to load all other users into the group entity, then exclude the current user
    return this.groupRepository.createQueryBuilder('group')
      .leftJoin('group.users', 'currentUser')
      .leftJoinAndSelect('group.users', 'user')
      .where('currentUser.id = :userId', {userId})
      .andWhere('user.id != :userId', {userId})
      .getMany();
  }
}
