import { Module, forwardRef } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports: [forwardRef(() => ChatModule)],
  providers: [SocketGateway],
  exports: [SocketGateway],
})
export class WebsocketModule {}