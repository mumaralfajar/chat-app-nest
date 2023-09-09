import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ChatRoomsService } from './chat-rooms.service';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';
import { ObjectIdPipe } from 'src/utils/pipes/object-id.pipe';

@ApiTags('Chat Room')
@Controller('chat-rooms')
export class ChatRoomsController {
  constructor(private readonly chatRoomsService: ChatRoomsService) {}

  @ApiOperation({
    summary: 'Get all chat rooms',
  })
  @Get()
  async findAll() {
    return await this.chatRoomsService.findAll();
  }

  @ApiOperation({
    summary: 'Get chat room by id',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: 'string',
    example: '64fcb26814862ce1d787958a',
  })
  @Get(':id')
  async findOne(@Param('id', ObjectIdPipe) id: ObjectId) {
    const result = await this.chatRoomsService.findOneById(id);
    if (!result) {
      throw new NotFoundException('Chat Room not found');
    }
    return result;
  }
}
