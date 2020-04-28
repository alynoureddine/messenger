import {
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Client, Server } from 'socket.io';

@WebSocketGateway(8080, { transports: ['websocket'] })
export class SocketGateway implements OnGatewayConnection {
  handleConnection(client: any, ...args: any[]): any {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('chat')
  handleChatEvent(@MessageBody() data: string): WsResponse {
    return { event: 'chat',  data: data };
  }

  @SubscribeMessage('event')
  handleEvent(client: Client, data: unknown): WsResponse {
    console.log(client);
    return { event: 'event',  data: data };
  }
}
