import { Module } from '@nestjs/common';
import { AuthGateway } from './auth.gateway';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  providers: [AuthGateway],
})
export class AuthModule {}
