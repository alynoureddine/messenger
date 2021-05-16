import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatEntity } from './chat.entity';
import { ChatService } from './chat.service';
import { UserModule } from '../users/user.module';
import { SocketModule } from '../socket/socket.module';
import { MessageModule } from '../message/message.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatEntity]),
    UserModule,
    MessageModule,
  ],
  providers: [ChatService],
  controllers: [ChatController],
  exports: [
    ChatService,
  ]
})
export class ChatModule {
}
