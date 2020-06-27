import { Body, Controller, Get, Post, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { LoginGuard } from '../common/guards/login.guard';
import { CreateUserDto } from '../users/dto';
import { UserEntity } from '../users/user.entity';
import { Public } from '../common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Public()
  @UseGuards(LoginGuard)
  @Post('login')
  async login(@Request() req) {
    return this.userService.findOne(req.user.id);
  }

  @Public()
  @UsePipes(ValidationPipe)
  @Post('register')
  async create(@Request() req, @Body() userData: CreateUserDto): Promise<UserEntity> {
    const user: UserEntity = await this.userService.create(userData);

    //Authenticate the user right after registration
    req.logIn(user, () => {});

    return user;
  }

  @Get('me')
  async meUser(@Request() req): Promise<UserEntity> {
    return this.userService.findOne(req.user.id);
  }
}
