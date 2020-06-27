import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { GroupService } from './group.service';
import { GroupEntity } from './group.entity';

@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {
  }

  @Post()
  create(@Req() request, @Body() requestDto: CreateGroupDto): Promise<GroupEntity> {
    return this.groupService.create(request.user.id, requestDto.friendIds);
  }

  @Get()
  getGroups(@Req() request): Promise<GroupEntity[]> {
    return this.groupService.getGroupList(request.user.id);
  }
}
