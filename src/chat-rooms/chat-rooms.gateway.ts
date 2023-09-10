import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { SOCKET_EVENT } from '../constants/socket.constant';
import { JoinChatRoomDto } from './dto/join-chat-room.dto';
import { SocketUser } from 'src/utils/decorators/socket-user.decorator';
import { ISocket, TSocketUser } from 'src/types/socket.type';
import { Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { SocketID } from 'src/utils/decorators/socket-id.decorator';
import { ChatRoomsService } from './chat-rooms.service';
import { Server } from 'socket.io';
import { NewMessageChatRoomDto } from './dto/new-message-chat-room.dto';
import { validate } from 'class-validator';

@WebSocketGateway()
export class ChatRoomsGateway {
  private readonly logger = new Logger(ChatRoomsGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(private readonly chatRoomsService: ChatRoomsService) {}

  @SubscribeMessage(SOCKET_EVENT.JOIN_CHAT_ROOM)
  async handleJoinChatRoom(
    @ConnectedSocket() client: ISocket,
    @SocketID() socketId: string,
    @SocketUser() user: TSocketUser,
    @MessageBody() dto: JoinChatRoomDto,
  ) {
    // console.log({
    //   id,
    //   user,
    //   dto,
    // });

    const chatRoomId = dto.chatRoomId;
    const userId = user._id;

    const isAlreadyJoined = await this.chatRoomsService.isUserParticipatedInChatRoom({
      chatRoomId,
      userId,
    });

    // console.log({ isAlreadyJoined });

    if (isAlreadyJoined) return;

    await this.chatRoomsService.addParticipantToChatRoom({ chatRoomId, userId });

    this.server.emit(SOCKET_EVENT.JOINED_CHAT_ROOM, { chatRoomId, user });
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage(SOCKET_EVENT.NEW_MESSAGE_CHAT_ROOM)
  async handleNewMessage(
    @ConnectedSocket() client: ISocket,
    @SocketID() socketId: string,
    @SocketUser() user: TSocketUser,
    @MessageBody() dto: NewMessageChatRoomDto,
  ) {
    console.log({ dto });
    const errors = await validate(dto);

    console.log({ errors });

    const userId = user._id;
    const { chatRoomId, message } = dto;

    console.log({ userId, chatRoomId, message });
  }
}
