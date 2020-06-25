import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { AuthenticatedGuard } from '../common/guards/authenticated.guard';

@Controller('users')
export class UserController {

  constructor(
    private readonly userService: UserService,
  ) {}

  @UseGuards(AuthenticatedGuard)
  @Get('friends')
  async getFriends(@Request() req): Promise<UserEntity[]> {
    return this.userService.getFriends(req.user.id);
  }
}
