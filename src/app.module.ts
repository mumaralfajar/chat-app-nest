import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './config/mongoose.config-service';
import { UsersModule } from './users/users.module';
import { ChatRoomsModule } from './chat-rooms/chat-rooms.module';
import { AuthModule } from './auth/auth.module';

import mongodbConfig from './config/mongodb.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration, mongodbConfig],
    }),
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    AuthModule,
    UsersModule,
    ChatRoomsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
