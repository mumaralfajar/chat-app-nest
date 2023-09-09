import { Controller, Get, Param } from '@nestjs/common';
import { ChatRoomsService } from './chat-rooms.service';

@Controller('chat-rooms')
export class ChatRoomsController {
  constructor(private readonly chatRoomsService: ChatRoomsService) {}

  @Get()
  findAll() {
    return this.chatRoomsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatRoomsService.findOneById(id);
  }
}
