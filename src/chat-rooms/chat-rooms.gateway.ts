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
import { BadRequestException, Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { SocketID } from 'src/utils/decorators/socket-id.decorator';
import { ChatRoomsService } from './chat-rooms.service';
import { Server } from 'socket.io';
import { NewMessageChatRoomDto } from './dto/new-message-chat-room.dto';

@WebSocketGateway()
export class ChatRoomsGateway {
  private readonly logger = new Logger(ChatRoomsGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(private readonly chatRoomsService: ChatRoomsService) {}

  @UsePipes(new ValidationPipe())
  @SubscribeMessage(SOCKET_EVENT.JOIN_CHAT_ROOM)
  async handleJoinChatRoom(
    @ConnectedSocket() client: ISocket,
    @SocketID() socketId: string,
    @SocketUser() user: TSocketUser,
    @MessageBody() dto: JoinChatRoomDto,
  ) {
    const userId = user._id;
    const { chatRoomId } = dto;

    const isAlreadyJoined = await this.chatRoomsService.isUserParticipatedInChatRoom({
      chatRoomId,
      userId,
    });

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
    console.log({ socketId, user, dto });

    const userId = user._id;
    const { chatRoomId, message } = dto;

    const isParticipant = await this.chatRoomsService.isUserParticipatedInChatRoom({
      chatRoomId,
      userId,
    });

    if (!isParticipant) throw new BadRequestException('You are not a participant');

    const chat = await this.chatRoomsService.addChatToChatRoom({ chatRoomId, userId, message });

    // console.log({ chat });
    this.server.emit(SOCKET_EVENT.BROADCAST_NEW_MESSAGE_CHAT_ROOM, { chatRoomId, chat });
  }
}
