import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

export interface AuthenticatedSocket extends Socket {
  user?: {
    id: number;
    email: string;
    pseudo: string;
  };
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AuthGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      // 1. Extraire le token (Query params ?token=... ou Header Authorization)
      const token =
        (client.handshake.query.token as string) ||
        client.handshake.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        console.log(`[WS] Refusé : Aucun token fourni (Socket ID: ${client.id})`);
        client.disconnect();
        return;
      }

      // 2. Décoder et vérifier le Token JWT
      const secret = this.configService.get<string>('JWT_SECRET');
      const payload = await this.jwtService.verifyAsync(token, { secret });

      // 3. VÉRIFICATION EN BDD : L'utilisateur existe-t-il vraiment ?
      const user = await this.userRepository.findOne({ where: { id: payload.sub } });
      if (!user) {
        console.log(`[WS] Refusé : L'utilisateur ID ${payload.sub} n'existe plus en BDD.`);
        client.disconnect();
        return;
      }

      // 4. LIAISON : On attache l'utilisateur à la session du Socket
      client.user = {
        id: user.id,
        email: user.email,
        pseudo: user.pseudo,
      };

      console.log(`[WS] Handshake accepté ! User ID ${client.user.id} (${client.user.pseudo}) connecté (Socket ID: ${client.id})`);
    } catch (error: any) {
      console.log(`[WS] Refusé : Token invalide ou expiré (${error.message})`);
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (client.user) {
      console.log(`[WS] User ID ${client.user.id} (${client.user.pseudo}) s'est déconnecté.`);
    }
  }

  @SubscribeMessage('ping_test')
  handlePing(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() data: any) {
    return {
      event: 'pong_test',
      data: {
        message: 'Connexion WebSocket active !',
        user: client.user,
      },
    };
  }
}