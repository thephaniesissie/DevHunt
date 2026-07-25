// src/notification/notification.controller.ts
import { Controller, Get, Post, Body, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';


export class CreateNotificationDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  userId!: number;

  @ApiProperty({ example: 'Nouveau message 💬' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'Vous avez reçu un nouveau message de l\'utilisateur #1' })
  @IsString()
  @IsNotEmpty()
  message!: string;
}

@ApiTags('Notifications')
@Controller('notification')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Créer et envoyer une notification',
    description: 'Crée une notification en base de données et l\'envoie en temps réel via WebSocket'
  })
  @ApiBody({
    type: CreateNotificationDto,
    examples: {
      default: {
        summary: 'Exemple de notification',
        value: {
          userId: 2,
          title: 'Nouveau message 💬',
          message: 'Vous avez reçu un nouveau message de l\'utilisateur #1'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Notification créée et envoyée',
    schema: {
      example: {
        id: 1,
        user: { id: 2, pseudo: 'user2' },
        title: 'Nouveau message 💬',
        message: 'Vous avez reçu un nouveau message de l\'utilisateur #1',
        createdAt: '2024-01-15T10:30:00.000Z',
        isRead: false
      }
    }
  })
  async sendNotification(@Body() body: CreateNotificationDto) {
    if (!body || !body.userId) {
      throw new Error("Le corps de la requête doit contenir 'userId', 'title' et 'message'");
    }

    return this.notificationService.createAndSendNotification(
      body.userId,
      body.title,
      body.message,
    );
  }

  @Get('user/:userId')
  @ApiOperation({ 
    summary: 'Récupérer toutes les notifications d\'un utilisateur',
    description: 'Retourne l\'historique complet des notifications d\'un utilisateur'
  })
  @ApiParam({ name: 'userId', type: 'number', example: 1, description: 'ID de l\'utilisateur' })
  @ApiResponse({ 
    status: 200, 
    description: 'Liste des notifications',
    schema: {
      example: [
        {
          id: 1,
          user: { id: 1, pseudo: 'user1' },
          title: 'Nouveau message 💬',
          message: 'Vous avez reçu un nouveau message de l\'utilisateur #2',
          createdAt: '2024-01-15T10:30:00.000Z',
          isRead: false
        }
      ]
    }
  })
  async getUserNotifications(@Param('userId', ParseIntPipe) userId: number) {
    return this.notificationService.getUserNotifications(userId);
  }

  @Patch(':id/read')
  @ApiOperation({ 
    summary: 'Marquer une notification comme lue',
    description: 'Met à jour le statut d\'une notification pour la marquer comme lue'
  })
  @ApiParam({ name: 'id', type: 'number', example: 1, description: 'ID de la notification' })
  @ApiResponse({ 
    status: 200, 
    description: 'Notification marquée comme lue',
    schema: {
      example: { success: true }
    }
  })
  async markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(id);
  }
}