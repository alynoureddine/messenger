import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(8080, { transports: ['websocket'] })
export class SocketGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('chat')
  handleChatEvent(@MessageBody() data: string): WsResponse {
    return { event: 'chat', data: data };
  }

  @SubscribeMessage('event')
  handleEvent(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): WsResponse {
    console.log(client);
    return { event: 'event', data: data };
  }
}
