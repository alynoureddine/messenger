import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect, OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  ClassSerializerInterceptor,
  UseFilters,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SocketAuthenticatedGuard } from '../common/guards/socket-authenticated.guard';
import { ChatService } from '../chat/chat.service';
import { CreateChatDto } from '../chat/dto/create-chat.dto';
import { CreateMessageDto } from '../message/dto/create-message.dto';
import { MessageService } from '../message/message.service';
import { ChatEntity } from '../chat/chat.entity';
import { UserEntity } from '../users/user.entity';
import { UserService } from '../users/user.service';
import { AllSocketExceptionsFilter } from '../common/filters/all-exceptions.filter';
import { SocketSession } from './socket-session.schema';
import { SocketSessionService } from './socket-session.service';
import { Friend } from '../common/classes/friend.class';
import { SocketService } from './socket.service';
import { MessageEntity } from '../message/message.entity';

@WebSocketGateway(8080, { transports: ['websocket'] })
@UseFilters(AllSocketExceptionsFilter)
@UseGuards(SocketAuthenticatedGuard)
@UsePipes(ValidationPipe)
@UseInterceptors(ClassSerializerInterceptor)
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly userService: UserService,
    private readonly messageService: MessageService,
    private readonly socketSessionService: SocketSessionService,
    private readonly socketService: SocketService,
  ) {}

  afterInit(server: any): any {
    this.socketService.server = server;
  }

  async handleConnection(socket: Socket): Promise<{ friends: Friend[]; chats: ChatEntity[] }> {
    const user: UserEntity = socket.request.user;

    if (!user) {
      return;
    }

    const socketSession: SocketSession = await this.socketSessionService.createOrUpdateSession(user.id, socket.id);
    const friends: UserEntity[] = await this.userService.getFriends(user.id);

    socket
    .to(`status-${user.id}`)
    .emit('friend-status', new Friend(socket.request.user.id, socketSession.lastSeen, true));

    await this.socketService.listenToChats(user.id, await this.chatService.getChatList(user.id));
    await this.socketService.listenToFriends(user.id, friends);

    // socket.emit('init', { friends, chats });
  }

  @SubscribeMessage('chat')
  async handleChatEvent(@MessageBody() chatDto: CreateChatDto, @ConnectedSocket() socket: Socket): Promise<ChatEntity> {
    const [chat, user]: [ChatEntity, UserEntity] = await Promise.all([
      this.chatService.create(socket.request.user.id, chatDto.friendId),
      this.userService.findOne(socket.request.user.id),
    ]);

    //todo move message creation to inside chat service and create a transaction for it
    const message: MessageEntity = await this.messageService.create(chatDto.message, chat, user);

    const chatRoom: string = `chat-${chat.id}`;

    socket.join(chatRoom);
    (await this.socketService.getSocketByUserId(chatDto.friendId))?.join(chatRoom);

    socket.to(chatRoom).emit('chat', { chat, message });

    return chat;
  }

  @SubscribeMessage('message')
  async handleMessageEvent(@MessageBody() messageDto: CreateMessageDto, @ConnectedSocket() socket: Socket) {
    const [chat, user]: [ChatEntity, UserEntity] = await Promise.all([
      this.chatService.findOne(messageDto.chatId),
      this.userService.findOne(socket.request.user.id),
    ]);

    const message: MessageEntity = await this.messageService.create(messageDto.text, chat, user);

    socket.to(`chat-${messageDto.chatId}`).emit('message', message);

    return message;
  }

  async handleDisconnect(socket: Socket): Promise<SocketSession> {
    if (!socket.request.user) {
      return;
    }

    const socketSession: SocketSession = await this.socketSessionService.createOrUpdateSession(
      socket.request.user.id,
      socket.id,
    );

    socket
      .to(`status-${socket.request.user.id}`)
      .emit('friend-status', new Friend(socket.request.user.id, socketSession.lastSeen, false));
  }

}
