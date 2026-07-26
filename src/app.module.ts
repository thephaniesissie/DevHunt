import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { SocketGateway } from './websocket/socket.gateway';
import { ProjectsModule } from './projects/projects.module';
import { ChatModule } from './chat/chat.module';
import { BadgeEarnedModule } from './badge_earned/badge_earned.module';
import { BadgesModule } from './badges/badges.module';
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), 
    AuthModule, 
    DatabaseModule, 
    UserModule,
    ProjectsModule,
    BadgesModule,
    ChatModule,
    BadgeEarnedModule
  ],
  controllers: [AppController],
  providers: [AppService, SocketGateway],
})
export class AppModule {}
