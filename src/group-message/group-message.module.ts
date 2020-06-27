import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupMessageEntity } from './group-message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([GroupMessageEntity]),
  ]
})
export class GroupMessageModule {}
