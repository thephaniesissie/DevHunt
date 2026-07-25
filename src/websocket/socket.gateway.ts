import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';

@Injectable()
@WebSocketGateway({ cors: { origin: '*' } })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;
  private logger = new Logger(SocketGateway.name);
  private socketToUser = new Map<string, number>();
  private userSockets = new Map<number, Set<string>>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token =
        (client.handshake.auth?.token as string) ||
        (client.handshake.query.token as string) ||
        client.handshake.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        this.logger.warn(`Socket ${client.id} refusé : aucun token fourni`);
        client.disconnect(true);
        return;
      }

      // IMPORTANT: même clé JWT_SECRET que celle utilisée pour SIGNER
      // les tokens (AuthModule/JwtModule) et par JwtStrategy. Avant, le
      // fallback ici était 'change_this_secret', différent du fallback
      // 'secret' utilisé dans JwtStrategy : deux secrets différents =
      // vérification qui échoue toujours si JWT_SECRET n'est pas défini.
      const secret = this.configService.get<string>('JWT_SECRET');
      if (!secret) {
        this.logger.error('JWT_SECRET manquant dans la configuration (.env)');
        client.disconnect(true);
        return;
      }

      const payload: any = await this.jwtService.verifyAsync(token, { secret });
      const userId = payload.sub;
      if (!userId) {
        this.logger.warn(`Socket ${client.id} refusé : payload de token invalide`);
        client.disconnect(true);
        return;
      }

      const user = await this.userService.findOne(userId);
      if (!user) {
        this.logger.warn(`Socket ${client.id} refusé : utilisateur ${userId} introuvable`);
        client.disconnect(true);
        return;
      }

      this.socketToUser.set(client.id, userId);
      const set = this.userSockets.get(userId) || new Set();
      set.add(client.id);
      this.userSockets.set(userId, set);

      client.data.userId = userId;
      client.data.user = { id: user.id, email: user.email, pseudo: user.pseudo };
      this.logger.log(`Socket connecté: ${client.id} -> user ${userId}`);
    } catch (err: any) {
      const errorMessage = err?.message || 'token invalide';
      this.logger.warn(`Connexion socket rejetée: ${errorMessage}`);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = this.socketToUser.get(client.id);
    if (userId) {
      const set = this.userSockets.get(userId);
      set?.delete(client.id);
      if (set && set.size === 0) this.userSockets.delete(userId);
      this.socketToUser.delete(client.id);
      this.logger.log(`Socket déconnecté: ${client.id} (user ${userId})`);
    }
  }

  // Utilitaire pour émettre une notification à un utilisateur donné
  emitToUser(userId: number, event: string, payload: any) {
    const sockets = this.userSockets.get(userId);
    if (!sockets || sockets.size === 0) {
      this.logger.warn(`Aucun socket connecté pour l'utilisateur ${userId}, notification perdue`);
      return;
    }
    for (const sid of sockets) {
    const s = this.server.sockets.sockets.get(sid);
    if (s) {
      s.emit(event, payload);
      // 👇 AJOUTEZ CE LOG POUR VOIR QUAND UN MESSAGE EST ENVOYÉ
      this.logger.log(`Message "${event}" envoyé avec succès au socket ${sid} (User ${userId})`);
    }
  }
  }
}