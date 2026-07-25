// src/chat/chat.service.ts
import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationService } from 'src/notification/notification.service';
import { Message } from './entities/chat.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @Inject(forwardRef(() => NotificationService))
    private readonly notificationService: NotificationService,
  ) {}

  async saveAndSendMessage(senderId: number, recipientId: number, content: string) {
  // 1. Sécurité : vérifier que le contenu existe
  if (!content) {
    throw new BadRequestException('Le contenu du message ne peut pas être vide');
  }

  // 2. Récupération de l'expéditeur pour la notification
  const sender = await this.messageRepository.manager
    .createQueryBuilder()
    .select('user')
    .from('User', 'user')
    .where('user.id = :id', { id: senderId })
    .getOne();

  // 3. Création avec passage direct des valeurs
  const message = this.messageRepository.create({
    senderId,
    recipientId,
    content,
  });

  const savedMessage = await this.messageRepository.save(message);

  // 4. Notification
  const senderPseudo = sender?.pseudo || `#${senderId}`;
  await this.notificationService.createAndSendNotification(
    recipientId,
    'Nouveau message privé 💬',
    `Vous avez reçu un nouveau message de ${senderPseudo}`,
  );

  return savedMessage;
}

  /**
   * Récupère l'historique de conversation entre deux utilisateurs
   */
  async getConversation(user1Id: number, user2Id: number) {
    return this.messageRepository.find({
      where: [
        { sender: { id: user1Id }, recipient: { id: user2Id } },
        { sender: { id: user2Id }, recipient: { id: user1Id } },
      ],
      order: { createdAt: 'ASC' },
      relations: {
        sender: true,
        recipient: true,
      },
    });
  }

  /**
   * Récupère tous les messages envoyés par un utilisateur
   */
  async getSentMessages(userId: number) {
    const messages = await this.messageRepository.find({
      where: { sender: { id: userId } },
      order: { createdAt: 'DESC' },
      relations: {
        recipient: true,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        isRead: true,
        recipient: {
          id: true,
          pseudo: true,
        },
      },
    });

    return messages;
  }

  /**
   * Récupère tous les messages reçus par un utilisateur
   */
  async getReceivedMessages(userId: number) {
    const messages = await this.messageRepository.find({
      where: { recipient: { id: userId } },
      order: { createdAt: 'DESC' },
      relations: {
        sender: true,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        isRead: true,
        sender: {
          id: true,
          pseudo: true,
        },
      },
    });

    return messages;
  }
}