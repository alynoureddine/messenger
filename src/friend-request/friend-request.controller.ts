import { Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common';
import { CreateFriendRequestDto } from './dto/create-friend-request-dto';
import { FriendRequestService } from './friend-request.service';

@Controller('friend-requests')
export class FriendRequestController {
  constructor(private readonly friendRequestService: FriendRequestService) {
  }

  @Get()
  get(@Req() request) {
    return this.friendRequestService.get(request.user);
  }

  @Post()
  create(@Req() request, @Body() requestDto: CreateFriendRequestDto) {
    return this.friendRequestService.create(request.user, requestDto);
  }

  @Put(':id/accept')
  accept(@Req() request, @Param() { id }: { id: number }) {
    return this.friendRequestService.acceptRequest(id, request.user);
  }

  @Put(':id/decline')
  decline(@Req() request, @Param() { id }: { id: number }) {
    return this.friendRequestService.declineRequest(id, request.user);
  }

  @Put(':id/cancel')
  cancel(@Req() request, @Param() { id }: { id: number }) {
    return this.friendRequestService.cancelRequest(id, request.user);
  }
}

