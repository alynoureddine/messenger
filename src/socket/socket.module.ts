import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { ChatModule } from '../chat/chat.module';
import { UserModule } from '../users/user.module';
import { MessageModule } from '../message/message.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SocketSession, SocketSessionSchema } from './socket-session.schema';
import { SocketSessionService } from './socket-session.service';
import { SocketService } from './socket.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SocketSession.name, schema: SocketSessionSchema }]),
    ChatModule,
    UserModule,
    MessageModule,
  ],
  providers: [
    SocketGateway,
    SocketSessionService,
    SocketService,
  ],
  exports: [
    SocketService,
  ]
})
export class SocketModule {}
