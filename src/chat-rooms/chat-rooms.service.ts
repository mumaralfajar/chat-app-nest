import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ChatRoom } from 'src/schemas/chat-room.schema';
import { Model, ObjectId } from 'mongoose';
import { Chat } from 'src/schemas/chat.schema';

@Injectable()
export class ChatRoomsService implements OnApplicationBootstrap {
  private readonly logger = new Logger(ChatRoomsService.name);

  constructor(
    @InjectModel(ChatRoom.name)
    private readonly chatRoomModel: Model<ChatRoom>,

    @InjectModel(Chat.name)
    private readonly chatModel: Model<Chat>,
  ) {}

  async create(createChatRoomDto: CreateChatRoomDto) {
    return await this.chatRoomModel.create(createChatRoomDto);
  }

  async findOneById(id: string | ObjectId) {
    return await this.chatRoomModel.findById(id).populate([
      {
        path: 'participants',
      },
      {
        path: 'chats',
        populate: {
          path: 'user',
        },
      },
    ]);
  }

  async findAll() {
    return await this.chatRoomModel.find().select({ _id: true, name: true }).populate({
      path: 'participants',
    });
  }

  async addParticipantToChatRoom({
    chatRoomId,
    userId,
  }: {
    chatRoomId: ObjectId | string;
    userId: ObjectId | string;
  }) {
    return await this.chatRoomModel.findByIdAndUpdate(chatRoomId, {
      $push: { participants: userId },
    });
  }

  async isUserParticipatedInChatRoom({
    chatRoomId,
    userId,
  }: {
    chatRoomId: ObjectId | string;
    userId: ObjectId | string;
  }) {
    const count = await this.chatRoomModel.count({ _id: chatRoomId, participants: userId });
    return !!count;
  }

  async addChatToChatRoom({
    chatRoomId,
    userId,
    message,
  }: {
    chatRoomId: ObjectId | string;
    userId: ObjectId | string;
    message: string;
  }) {
    const chat = await this.chatModel.create({ message, user: userId });
    return await this.chatRoomModel.findByIdAndUpdate(chatRoomId, {
      $push: { chats: chat },
    });
  }

  async onApplicationBootstrap() {
    await this.generateChatRooms();
  }

  async generateChatRooms() {
    const chatRooms = await this.findAll();

    if (chatRooms.length === 0) {
      for (let i = 1; i <= 5; i++) {
        const chatRoom = await this.create({
          name: `Chat Room ${i}`,
        });

        chatRooms.push(chatRoom);
      }
    }

    this.logger.log(
      `Chat Rooms generated`,
      chatRooms.map((chatRoom) => chatRoom.name),
    );
  }
}
