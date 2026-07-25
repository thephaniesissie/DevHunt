// src/notification/notification.service.ts
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { SocketGateway } from 'src/websocket/socket.gateway';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @Inject(forwardRef(() => SocketGateway))
    private readonly socketGateway: SocketGateway,
  ) {}

  async createAndSendNotification(userId: number, title: string, message: string) {
    const notification = this.notificationRepository.create({
      user: { id: userId },
      title,
      message,
    });
    const savedNotification = await this.notificationRepository.save(notification);

    // Envoi via WebSocket
    this.socketGateway.emitToUser(userId, 'new_notification', savedNotification);

    return savedNotification;
  }

  // Historique des notifications
  async getUserNotifications(userId: number) {
    return this.notificationRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      relations: {
        user: true,
      },
      select: {
        id: true,
        title: true,
        message: true,
        createdAt: true,
        isRead: true,
        user: {
          id: true,
          pseudo: true,
        },
      },
    });
  }

  // Marquer comme lue
  async markAsRead(notificationId: string) {
    await this.notificationRepository.update(notificationId, { isRead: true });
    return { success: true };
  }
}