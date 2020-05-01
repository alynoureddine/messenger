import { Body, Controller, Post, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { LoginGuard } from '../common/guards/login.guard';
import { UserService } from './user.service';
import { CreateUserDto } from './dto';
import { UserEntity } from './user.entity';

@Controller('users')
export class UserController {

  constructor(private readonly userService: UserService) {}

  @UseGuards(LoginGuard)
  @Post('login')
  async login(@Request() req) {
    return await this.userService.findOne(req.user.username);
  }

  @UsePipes(ValidationPipe)
  @Post()
  async create(@Body() userData: CreateUserDto): Promise<UserEntity> {
    return this.userService.create(userData);
  }
}
