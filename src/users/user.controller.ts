import { Controller, Get, Query, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';

@Controller('users')
export class UserController {

  constructor(
    private readonly userService: UserService,
  ) {}

  @Get('friends')
  async getFriends(@Request() req): Promise<UserEntity[]> {
    return this.userService.getFriends(req.user.id);
  }

  @Get()
  async getUsers(@Request() req, @Query('username') username: string): Promise<UserEntity[]> {
    return this.userService.getUsers(username);
  }
}
