import { HttpException, Injectable } from '@nestjs/common';
import { UserEntity } from '../users/user.entity';
import { Friend } from '../common/classes/friend.class';
import { SocketSession } from './socket-session.schema';
import { SocketSessionService } from './socket-session.service';
import { UserService } from '../users/user.service';
import { ChatEntity } from '../chat/chat.entity';
import { ChatService } from '../chat/chat.service';
import { Server, Socket } from 'socket.io';
import { SocketGateway } from './socket.gateway';
import { MessageEntity } from '../message/message.entity';

@Injectable()
export class SocketService {
  public server: Server;

  constructor(
    private readonly userService: UserService,
    private readonly socketSessionService: SocketSessionService,
  ) {}

  async listenToFriends(userId: number, friends: UserEntity[]): Promise<void> {
    const socket: Socket = await this.getSocketByUserId(userId);

    friends.forEach(friend => socket.join(`status-${friend.id}`));
  }

  async getFriends(userId: number, users: UserEntity[]): Promise<Friend[]> {
    const socket: Socket = await this.getSocketByUserId(userId);

    return await Promise.all(
      users.map(async user => {
        const socketSession: SocketSession = await this.socketSessionService.findSessionByUserId(user.id);
        const isConnected: boolean = socketSession
          ? socket?.server.sockets.sockets[socketSession.socketId]?.connected
          : false;

        return new Friend(user, socketSession?.lastSeen, isConnected);
      }),
    );
  }

  async listenToChats(userId: number, chats: ChatEntity[]): Promise<ChatEntity[]> {
    // const chats: ChatEntity[] = await this.chatService.getChatList(socket.request.user.id);
    const socket: Socket = await this.getSocketByUserId(userId);

    if (!socket) {
      return;
    }

    chats.forEach((chat) => socket.join(`chat-${chat.id}`));

    return chats;
  }

  async getSocketByUserId(userId: number): Promise<Socket> {
    const socketSession: SocketSession = await this.socketSessionService.findSessionByUserId(userId);

    if (!socketSession) {
      return null;
    }

    return this.server.sockets.sockets[socketSession.socketId];
  }

  async emitNewChat(userId: number, chat: ChatEntity, message: MessageEntity): Promise<void> {
    const chatRoom: string = `chat-${chat.id}`;
    const sockets: Socket[] = await Promise.all(chat.users.map(user => this.getSocketByUserId(user.id)));

    sockets.forEach((socket: Socket) => socket?.join(chatRoom));

    (await this.getSocketByUserId(userId)).to(chatRoom).emit('chat', { chat, message });
  }
}
