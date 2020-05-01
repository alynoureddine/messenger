import { Module } from '@nestjs/common';
import { FriendRequestService } from './friend-request.service';
import { FriendRequestController } from './friend-request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendRequestEntity } from './friend-request.entity';
import { UserEntity } from '../users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FriendRequestEntity, UserEntity]),
  ],
  providers: [FriendRequestService],
  controllers: [FriendRequestController]
})
export class FriendRequestModule {}
