import { Controller, Get, Query, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { SocketService } from '../socket/socket.service';
import { Friend } from '../common/classes/friend.class';
import { ModuleRef } from '@nestjs/core';

@Controller('users')
export class UserController {

  private socketService: SocketService

  constructor(
    private readonly userService: UserService,
    private moduleRef: ModuleRef,
  ) {}

  onModuleInit(): void {
    this.socketService = this.moduleRef.get(SocketService, { strict: false });
  }

  @Get('friends')
  async getFriends(@Request() request): Promise<Friend[] | UserEntity[]> {
    const friends: UserEntity[] = await this.userService.getFriends(request.user.id);
    return this.socketService.getFriends(request.user.id, friends);
  }

  @Get()
  async getUsers(@Request() request, @Query('username') username: string): Promise<UserEntity[]> {
    return this.userService.getUsers(username);
  }
}
