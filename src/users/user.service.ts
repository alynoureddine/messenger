import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto';
import { validate } from 'class-validator';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
  }

  async findOne(id: number): Promise<UserEntity> {
    return this.userRepository.findOne({ id });
  }

  async findOneByUsername(username: string): Promise<UserEntity> {
    return this.userRepository.findOne({ username });
  }

  async create(dto: CreateUserDto): Promise<UserEntity> {

    // check uniqueness of username/email
    const { username, email, password, firstName, lastName } = dto;
    const qb = this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .orWhere('user.email = :email', { email });

    const user = await qb.getOne();

    if (user) {
      throw new BadRequestException(['Username or email already taken.'])
    }

    // create new user
    let newUser = new UserEntity();
    newUser.username = username;
    newUser.email = email;
    newUser.password = password;
    newUser.firstName = firstName;
    newUser.lastName = lastName;

    // const errors = await validate(newUser);
    // console.log(errors);
    // if (errors.length > 0) {
    //   const errors = { username: 'User input is not valid.' };
    //   throw new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.BAD_REQUEST);
    //
    // } else {
      return this.userRepository.save(newUser);
    // }
  }

  public async getFriends(id: number): Promise<UserEntity[]> {
    const user: UserEntity = await this.userRepository.findOne({ id }, { relations: ['friends'] });

    return user.friends;
  }

  public async getFriend(userId: number, friendId: number): Promise<UserEntity> {
    // get friend and make sure that both users are actually friends
    return this.userRepository.createQueryBuilder('friend')
      .leftJoin('friend.friends', 'user')
      .where('friend.id = :friendId', { friendId })
      .andWhere('user.id = :userId', { userId })
      .getOne();
  }

  public getUsers(username: string): Promise<UserEntity[]> {
    return this.userRepository.createQueryBuilder('user')
      .where('user.username like :username', {username: `%${username}%`})
      .getMany()
  }
}
