import {
  // ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { SOCKET_MESSAGE } from './chat-rooms.constant';
import { JoinChatRoomDto } from './dto/join-chat-room.dto';
import { SocketUser } from 'src/utils/decorators/socket-user.decorator';
import { TSocketUser } from 'src/types/socket.type';
import { Logger } from '@nestjs/common';
import { SocketID } from 'src/utils/decorators/socket-id.decorator';
import { ChatRoomsService } from './chat-rooms.service';

@WebSocketGateway()
export class ChatRoomsGateway {
  private readonly logger = new Logger(ChatRoomsGateway.name);

  constructor(private readonly chatRoomsService: ChatRoomsService) {}

  // @SubscribeMessage('message')
  // handleMessage(client: any, payload: any): string {
  //   return 'Hello world!';
  // }

  @SubscribeMessage(SOCKET_MESSAGE.JOIN_CHAT_ROOM)
  async handleJoinChatRoom(
    // @ConnectedSocket() client: ISocket,
    @SocketID() id: string,
    @SocketUser() user: TSocketUser,
    @MessageBody() joinChatRoomDto: JoinChatRoomDto,
  ) {
    console.log({
      id,
      user,
      joinChatRoomDto,
    });

    const chatRoomId = joinChatRoomDto.chatRoomId;
    const userId = user._id;

    const isAlreadyJoined = await this.chatRoomsService.isUserParticipatedInChatRoom({
      chatRoomId,
      userId,
    });

    if (isAlreadyJoined) return;

    await this.chatRoomsService.addParticipantToChatRoom({ chatRoomId, userId });
  }
}
