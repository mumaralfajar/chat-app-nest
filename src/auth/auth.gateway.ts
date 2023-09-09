import { Logger } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { isValidObjectId } from 'mongoose';
import { Server } from 'socket.io';
import { ISocket } from 'src/types/socket.type';
import { UsersService } from 'src/users/users.service';

@WebSocketGateway()
export class AuthGateway {
  private readonly logger = new Logger(AuthGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(private readonly usersService: UsersService) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handleConnection(client: ISocket, ...args: any[]) {
    try {
      // console.dir({ client, args }, { depth: 2 });

      const { id } = client;
      const { userId } = client.handshake.query;

      if (typeof userId !== 'string' || !isValidObjectId(userId)) {
        client.disconnect();
        throw new WsException(`Invalid userId: ${userId}`);
      }

      const user = await this.usersService.findOneById(userId);

      if (!user) {
        client.disconnect();
        throw new WsException(`userId ${userId} not found`);
      }

      client.data.user = { _id: user._id, name: user.name };

      this.logger.log(`Client Connected`, { id, user: client.data.user });
    } catch (error) {
      this.logger.error(error);
    }
  }

  handleDisconnect(client: ISocket) {
    const { id } = client;
    const { user } = client.data;

    this.logger.warn(`Client Disconnected`, { id, user });
  }
}
