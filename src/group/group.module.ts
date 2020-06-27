import { Module } from '@nestjs/common';
import { GroupController } from './group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupEntity } from './group.entity';
import { GroupService } from './group.service';
import { UserModule } from '../users/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GroupEntity]),
    UserModule,
  ],
  providers: [GroupService],
  controllers: [GroupController],
})
export class GroupModule {

}
