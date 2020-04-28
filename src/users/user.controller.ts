import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LoginGuard } from '../common/guards/login.guard';
import { UserService } from './user.service';
import { CreateUserDto } from './dto';
import { UserEntity } from './user.entity';

@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) {}

  @UseGuards(LoginGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('login')
  async login(@Request() req) {
    return await this.userService.findOne(req.user.username);
  }

  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Body() userData: CreateUserDto): Promise<UserEntity> {
    return this.userService.create(userData);
  }
}
