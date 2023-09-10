import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { SOCKET } from './chat-rooms.constant';
import { JoinChatRoomDto } from './dto/join-chat-room.dto';
import { SocketUser } from 'src/utils/decorators/socket-user.decorator';
import { ISocket, TSocketUser } from 'src/types/socket.type';
import { Logger } from '@nestjs/common';
import { SocketID } from 'src/utils/decorators/socket-id.decorator';
import { ChatRoomsService } from './chat-rooms.service';
import { Server } from 'socket.io';

@WebSocketGateway()
export class ChatRoomsGateway {
  private readonly logger = new Logger(ChatRoomsGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(private readonly chatRoomsService: ChatRoomsService) {}

  @SubscribeMessage(SOCKET.JOIN_CHAT_ROOM)
  async handleJoinChatRoom(
    @ConnectedSocket() client: ISocket,
    @SocketID() socketId: string,
    @SocketUser() user: TSocketUser,
    @MessageBody() joinChatRoomDto: JoinChatRoomDto,
  ) {
    // console.log({
    //   id,
    //   user,
    //   joinChatRoomDto,
    // });

    const chatRoomId = joinChatRoomDto.chatRoomId;
    const userId = user._id;

    const isAlreadyJoined = await this.chatRoomsService.isUserParticipatedInChatRoom({
      chatRoomId,
      userId,
    });

    // console.log({ isAlreadyJoined });

    if (isAlreadyJoined) return;

    await this.chatRoomsService.addParticipantToChatRoom({ chatRoomId, userId });

    this.server.emit(SOCKET.JOINED_CHAT_ROOM, { socketId, chatRoomId, userId });
  }
}
