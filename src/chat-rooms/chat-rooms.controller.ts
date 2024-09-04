import { Controller, Get, NotFoundException, Param, UseGuards, Version } from '@nestjs/common';
import { ChatRoomsService } from './chat-rooms.service';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';
import { ObjectIdPipe } from 'src/utils/pipes/object-id.pipe';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Chat Room')
@Controller('chat-rooms')
@UseGuards(JwtAuthGuard)
export class ChatRoomsController {
  constructor(private readonly chatRoomsService: ChatRoomsService) {}

  @ApiOperation({
    summary: 'Get all chat rooms',
  })
  @Version('1')
  @Get()
  async findAll() {
    return await this.chatRoomsService.findAll();
  }

  @ApiOperation({
    summary: 'Get chat room by id',
  })
  @Version('1')
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
