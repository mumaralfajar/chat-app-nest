import { Injectable } from '@nestjs/common';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ChatRoom } from 'src/schemas/chat-room.schema';
import { Model, ObjectId } from 'mongoose';
import { Chat } from 'src/schemas/chat.schema';

@Injectable()
export class ChatRoomsService {
  constructor(
    @InjectModel(ChatRoom.name)
    private readonly chatRoomModel: Model<ChatRoom>,
    @InjectModel(Chat.name)
    private readonly chatModel: Model<Chat>,
  ) {}

  async create(createChatRoomDto: CreateChatRoomDto) {
    return await new this.chatRoomModel(createChatRoomDto).save();
  }

  async findOneById(id: string | ObjectId) {
    return await this.chatRoomModel.findById(id);
  }

  async findAll() {
    return await this.chatRoomModel.find();
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
}
