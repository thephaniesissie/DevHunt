import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SocketGateway } from '../websocket/socket.gateway';

class NotifyDto {
  userId!: number;
  message!: string;
}

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly gateway: SocketGateway) {}

  @Post('send')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  sendNotification(@Body() body: NotifyDto) {
    this.gateway.emitToUser(body.userId, 'notification', { message: body.message });
    return { ok: true };
  }
}