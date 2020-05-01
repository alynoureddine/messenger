import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FriendRequestEntity } from './friend-request.entity';
import { CreateFriendRequestDto } from './dto/create-friend-request-dto';
import { UserEntity } from '../users/user.entity';
import { FriendRequestStatus } from './enum/friend-request.status';

@Injectable()
export class FriendRequestService {
  constructor(
    @InjectRepository(FriendRequestEntity)
    private readonly friendRepository: Repository<FriendRequestEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {
  }

  public async create(requester: UserEntity, { username }: CreateFriendRequestDto): Promise<FriendRequestEntity> {
    const responder: UserEntity = await this.userRepository.findOne( { username });

    // check if user exists
    if (!responder) {
      throw new HttpException('Invalid username', HttpStatus.BAD_REQUEST);
    }

    // check if user is sending request to them self
    if (requester.id === responder.id) {
      throw new HttpException('Invalid username', HttpStatus.BAD_REQUEST);
    }

    // check if request is still pending
    const friendRequest = await this.friendRepository.findOne({
      requester,
      responder,
      status: FriendRequestStatus.PENDING,
    });

    if (friendRequest) {
      throw new HttpException('Friend request is still pending', HttpStatus.BAD_REQUEST);
    }

    // check if the two users are already friends
    const friend: UserEntity = await this.getFriend(requester, responder);

    if (friend) {
      throw new HttpException(`${responder.username} is already a friend`, HttpStatus.BAD_REQUEST);
    }

    // create friend request
    let newFriendRequest: FriendRequestEntity = new FriendRequestEntity();

    newFriendRequest.requester = requester;
    newFriendRequest.responder = responder;
    newFriendRequest.status = FriendRequestStatus.PENDING;

    return this.friendRepository.save(newFriendRequest);
  }

  public async acceptRequest(id: number, responder: UserEntity): Promise<FriendRequestEntity> {
    let friendRequest: FriendRequestEntity = await this.friendRepository.findOne({ id, responder });

    if (!friendRequest) {
      throw new HttpException('invalid friend request id', HttpStatus.BAD_REQUEST);
    }

    if (friendRequest.status !== FriendRequestStatus.PENDING) {
        throw new HttpException('Friend request is not pending anymore', HttpStatus.BAD_REQUEST);
    }

    friendRequest.status = FriendRequestStatus.ACCEPTED;
    this.addFriend(friendRequest.requester, friendRequest.responder);

    return this.friendRepository.save(friendRequest);
  }

  public async declineRequest(id: number, responder: UserEntity): Promise<FriendRequestEntity> {
    let friendRequest: FriendRequestEntity = await this.friendRepository.findOne({ id, responder });

    if (!friendRequest) {
      throw new HttpException('invalid friend request id', HttpStatus.BAD_REQUEST);
    }

    if (friendRequest.status !== FriendRequestStatus.PENDING) {
      throw new HttpException('Friend request is not pending anymore', HttpStatus.BAD_REQUEST);
    }

    friendRequest.status = FriendRequestStatus.DECLINED;

    return this.friendRepository.save(friendRequest);
  }

  public async cancelRequest(id: number, requester: UserEntity): Promise<FriendRequestEntity> {
    let friendRequest: FriendRequestEntity = await this.friendRepository.findOne({ id, requester });

    if (!friendRequest) {
      throw new HttpException('invalid friend request id', HttpStatus.BAD_REQUEST);
    }

    if (friendRequest.status !== FriendRequestStatus.PENDING) {
      throw new HttpException('Friend request is not pending anymore', HttpStatus.BAD_REQUEST);
    }

    friendRequest.status = FriendRequestStatus.CANCELLED;

    return this.friendRepository.save(friendRequest);
  }

  // add responder as a friend to requester and vise versa
  private async addFriend(userOne: UserEntity, userTwo: UserEntity): Promise<void> {
    const friend: UserEntity = await this.getFriend(userOne, userTwo);

    if(friend) {
      throw new HttpException('Friend already added', HttpStatus.BAD_REQUEST);
    }

    // add userTwo to userOne's friends
    this.userRepository.createQueryBuilder()
      .relation(UserEntity, 'friends')
      .of(userOne)
      .add(userTwo);

    // add userOne to userTwo's friends too, since it's a two-way relationship
    this.userRepository.createQueryBuilder()
      .relation(UserEntity, 'friends')
      .of(userTwo)
      .add(userOne);
  }

  private async getFriend(userOne: UserEntity, userTwo: UserEntity): Promise<UserEntity> {
    return  await this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.friends', 'friends')
      .where('user.id = :userOneId', { userOneId: userOne.id })
      .andWhere('friends.id = :userTwoId', { userTwoId: userTwo.id })
      .getOne();
  }
}
