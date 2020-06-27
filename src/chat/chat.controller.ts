import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatService } from './chat.service';
import { ChatEntity } from './chat.entity';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {
  }

  @Post()
  create(@Req() request, @Body() requestDto: CreateChatDto): Promise<ChatEntity> {
    return this.chatService.create(request.user.id, requestDto.friendId);
  }

  @Get()
  getChats(@Req() request): Promise<ChatEntity[]> {
    return this.chatService.getChatList(request.user.id);
  }
}
