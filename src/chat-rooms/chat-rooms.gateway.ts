import { MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { NewChatRoomDto } from './dto/new-chat-room.dto';

@WebSocketGateway()
export class ChatRoomsGateway {
  // @SubscribeMessage('message')
  // handleMessage(client: any, payload: any): string {
  //   return 'Hello world!';
  // }

  @SubscribeMessage('NEW_CHAT_ROOM')
  handleNewChatRoom(@MessageBody() newChatRoom: NewChatRoomDto) {
    console.log({ newChatRoom });
  }
}
