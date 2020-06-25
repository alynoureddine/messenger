import { Body, Controller, Get, Post, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { LoginGuard } from '../common/guards/login.guard';
import { CreateUserDto } from '../users/dto';
import { UserEntity } from '../users/user.entity';
import { AuthenticatedGuard } from '../common/guards/authenticated.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @UseGuards(LoginGuard)
  @Post('login')
  async login(@Request() req) {
    return this.userService.findOne(req.user.id);
  }

  @UsePipes(ValidationPipe)
  @Post('register')
  async create(@Request() req, @Body() userData: CreateUserDto): Promise<UserEntity> {
    const user: UserEntity = await this.userService.create(userData);

    //Authenticate the user right after registration
    req.logIn(user, () => {});

    return user;
  }

  @UseGuards(AuthenticatedGuard)
  @Get('me')
  async meUser(@Request() req): Promise<UserEntity> {
    return this.userService.findOne(req.user.id);
  }
}
