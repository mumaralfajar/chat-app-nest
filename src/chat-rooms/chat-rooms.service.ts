import { Injectable } from '@nestjs/common';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ChatRoom } from 'src/schemas/chat-room.schema';
import { Model } from 'mongoose';

@Injectable()
export class ChatRoomsService {
  constructor(@InjectModel(ChatRoom.name) private readonly chatRoomModel: Model<ChatRoom>) {}

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
