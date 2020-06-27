import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatEntity } from './chat.entity';
import { ChatService } from './chat.service';
import { UserModule } from '../users/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatEntity]),
    UserModule,
  ],
  providers: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {
}
