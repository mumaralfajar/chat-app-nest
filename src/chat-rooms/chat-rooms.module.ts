import { Module } from '@nestjs/common';
import { ChatRoomsService } from './chat-rooms.service';
import { ChatRoomsController } from './chat-rooms.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatRoom, ChatRoomSchema } from 'src/schemas/chat-room.schema';
import { Chat, ChatSchema } from 'src/schemas/chat.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ChatRoom.name,
        schema: ChatRoomSchema,
      },
      {
        name: Chat.name,
        schema: ChatSchema,
      },
    ]),
  ],
  controllers: [ChatRoomsController],
  providers: [ChatRoomsService],
  exports: [ChatRoomsService],
})
export class ChatRoomsModule {}
