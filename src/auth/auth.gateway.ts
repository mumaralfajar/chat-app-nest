import { Logger } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
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
    // console.dir({ client, args }, { depth: 2 });

    const { id: socketId } = client;
    const { userId } = client.handshake.query;

    if (typeof userId !== 'string') throw new WsException('Invalid userId');

    const user = await this.usersService.findOneById(userId);

    if (!user) throw new WsException(`User with id ${userId} not found`);

    this.logger.log(`Client Connected`, { socketId, userId });
  }

  handleDisconnect(client: ISocket) {
    const { id: socketId } = client;
    const { userId } = client.handshake.query;

    this.logger.warn(`Client Disconnected`, { socketId, userId });
  }
}
