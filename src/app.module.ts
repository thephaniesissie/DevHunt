import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { SocketGateway } from './websocket/socket.gateway';
import { NotificationModule } from './notification/notification.module';
import { ChatModule } from './chat/chat.module';
import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, DatabaseModule, UserModule, NotificationModule, ChatModule, WebsocketModule],
  controllers: [AppController],
  providers: [AppService, SocketGateway],
})
export class AppModule {}
