import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatService } from './chat.service';
import { ChatEntity } from './chat.entity';
import { Request } from '../common/interfaces/request.interface';
import { SocketService } from '../socket/socket.service';
import { ModuleRef } from '@nestjs/core';
import { MessageEntity } from '../message/message.entity';
import { MessageService } from '../message/message.service';

@Controller('chats')
export class ChatController {

  private socketService: SocketService

  constructor(
    private readonly chatService: ChatService,
    private readonly messageService: MessageService,
    private moduleRef: ModuleRef,
  ) {}

  onModuleInit(): void {
    this.socketService = this.moduleRef.get(SocketService, { strict: false });
  }

  @Post()
  async create(@Req() request: Request, @Body() requestDto: CreateChatDto): Promise<ChatEntity> {
    const chat: ChatEntity = await this.chatService.create(request.user.id, requestDto.friendId);
    const message: MessageEntity = await this.messageService.create(requestDto.message, chat, request.user);

    this.socketService.emitNewChat(request.user.id, chat, message);

    return chat;
  }

  @Get()
  async getChats(@Req() request): Promise<ChatEntity[]> {
    return this.chatService.getChatList(request.user.id);
  }

  @Get(':id')
  async getChat(@Param() params, @Req() request): Promise<ChatEntity> {
    return this.chatService.getChatById(params.id, request.user.id);
  }
}
