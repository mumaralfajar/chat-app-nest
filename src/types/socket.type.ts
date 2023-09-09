import { Socket } from 'socket.io';
import { User } from 'src/schemas/user.schema';

export interface ISocket extends Socket {
  data: {
    user: Pick<User, '_id' | 'name'>;
  };
}
