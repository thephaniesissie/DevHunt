// src/websocket/socket.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { ChatService } from 'src/chat/chat.service';

@Injectable()
@WebSocketGateway({ cors: { origin: '*' } })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server!: Server;
  private readonly logger = new Logger(SocketGateway.name);

  private socketToUser = new Map<string, number>();
  private userSockets = new Map<number, Set<string>>();

  constructor(
    @Inject(forwardRef(() => ChatService))
    private readonly chatService: ChatService,
  ) {}

  handleConnection(client: Socket) {
    // Authentification via JWT / handshake (code précédent...)
    const userId = Number(client.handshake.query.userId); // Exemple d'extraction
    if (userId) {
      this.socketToUser.set(client.id, userId);
      const set = this.userSockets.get(userId) || new Set();
      set.add(client.id);
      this.userSockets.set(userId, set);
      client.data.userId = userId;
      this.logger.log(`🟢 User ${userId} connecté sur socket ${client.id}`);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = this.socketToUser.get(client.id);
    if (userId) {
      const set = this.userSockets.get(userId);
      set?.delete(client.id);
      if (set && set.size === 0) this.userSockets.delete(userId);
      this.socketToUser.delete(client.id);
      this.logger.warn(`🔴 User ${userId} déconnecté du socket ${client.id}`);
    }
  }

  /**
   * Événement de messagerie instantanée entre deux utilisateurs
   */
  @SubscribeMessage('send_private_message')
  async handlePrivateMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { recipientId: number; content: string },
  ) {
    const senderId = client.data.userId;

    if (!senderId) {
      return { error: 'Utilisateur non authentifié' };
    }

    // 1. Sauvegarde BDD + Envoi auto de notification via ChatService
    const savedMessage = await this.chatService.saveAndSendMessage(
      senderId,
      payload.recipientId,
      payload.content,
    );

    // 2. Émettre le message au destinataire via WebSocket (s'il est en ligne)
    this.emitToUser(payload.recipientId, 'receive_private_message', savedMessage);

    // 3. Retourner une confirmation à l'expéditeur
    return { status: 'sent', message: savedMessage };
  }

  /**
   * Méthode utilitaire pour diffuser un événement à toutes les connexions d'un utilisateur
   */
  emitToUser(userId: number, event: string, payload: any) {
    const sockets = this.userSockets.get(userId);
    if (!sockets || sockets.size === 0) {
      this.logger.warn(`⚠️ User ${userId} déconnecté du socket : la notification reste stockée en BDD.`);
      return;
    }
    for (const sid of sockets) {
      const s = this.server?.sockets?.sockets?.get(sid);
      if (s) {
        s.emit(event, payload);
        this.logger.log(`⚡ Event "${event}" transmis avec succès au socket ${sid}`);
      }
    }
  }
}