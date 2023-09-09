import { Injectable } from '@nestjs/common';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';

@Injectable()
export class ChatRoomsService {
  async create(createChatRoomDto: CreateChatRoomDto) {
    console.log({ createChatRoomDto });

    return undefined;
  }

  async findAll() {
    return undefined;
  }

  async findOne(id: number) {
    console.log({ id });

    return undefined;
  }
}
