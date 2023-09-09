import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BaseWithTimestamps } from './base.schema';
import { User } from './user.schema';

export type ChatRoomDocument = HydratedDocument<ChatRoom>;

@Schema({ timestamps: true })
export class ChatRoom extends BaseWithTimestamps {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  participants: User[];
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
