// src/chat/chat.controller.ts
import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class SendMessageDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  senderId!: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  @IsPositive()
  recipientId!: number;

  @ApiProperty({ example: 'Bonjour, comment ça va ?' })
  @IsString()
  @IsNotEmpty()
  content!: string;
}

@ApiTags('Chat')
@Controller('chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('send')
  @ApiOperation({ 
    summary: 'Envoyer un message privé',
    description: 'Envoie un message d\'un utilisateur à un autre et déclenche une notification'
  })
  @ApiBody({
    type: SendMessageDto,
    examples: {
      default: {
        summary: 'Exemple d\'envoi de message',
        value: {
          senderId: 1,
          recipientId: 2,
          content: 'Bonjour, comment ça va ?'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Message envoyé avec succès'
  })
  async sendMessage(@Body() body: SendMessageDto) {
    return this.chatService.saveAndSendMessage(
      body.senderId,
      body.recipientId,
      body.content,
    );
  }

  @Get('conversation/:user1Id/:user2Id')
  @ApiOperation({ 
    summary: 'Récupérer l\'historique de conversation',
    description: 'Retourne tous les messages échangés entre deux utilisateurs'
  })
  @ApiParam({ name: 'user1Id', type: 'number', example: 1, description: 'ID du premier utilisateur' })
  @ApiParam({ name: 'user2Id', type: 'number', example: 2, description: 'ID du second utilisateur' })
  @ApiResponse({ 
    status: 200, 
    description: 'Historique de conversation'
  })
  async getConversation(
    @Param('user1Id', ParseIntPipe) user1Id: number,
    @Param('user2Id', ParseIntPipe) user2Id: number,
  ) {
    return this.chatService.getConversation(user1Id, user2Id);
  }

  // NOUVEL ENDPOINT : Récupérer tous les messages envoyés par un utilisateur
  @Get('sent/:userId')
  @ApiOperation({ 
    summary: 'Récupérer tous les messages envoyés par un utilisateur',
    description: 'Retourne tous les messages qu\'un utilisateur a envoyés, avec les détails du destinataire'
  })
  @ApiParam({ 
    name: 'userId', 
    type: 'number', 
    example: 1, 
    description: 'ID de l\'utilisateur dont on veut voir les messages envoyés' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Liste des messages envoyés',
    schema: {
      example: [
        {
          id: 1,
          content: 'Bonjour, comment ça va ?',
          createdAt: '2024-01-15T10:30:00.000Z',
          isRead: true,
          recipient: {
            id: 2,
            pseudo: 'jean_dupont'
          }
        },
        {
          id: 3,
          content: 'Très bien merci !',
          createdAt: '2024-01-15T10:35:00.000Z',
          isRead: false,
          recipient: {
            id: 4,
            pseudo: 'marie_martin'
          }
        }
      ]
    }
  })
  async getSentMessages(@Param('userId', ParseIntPipe) userId: number) {
    return this.chatService.getSentMessages(userId);
  }

  // NOUVEL ENDPOINT : Récupérer tous les messages reçus par un utilisateur
  @Get('received/:userId')
  @ApiOperation({ 
    summary: 'Récupérer tous les messages reçus par un utilisateur',
    description: 'Retourne tous les messages qu\'un utilisateur a reçus, avec les détails de l\'expéditeur'
  })
  @ApiParam({ 
    name: 'userId', 
    type: 'number', 
    example: 1, 
    description: 'ID de l\'utilisateur dont on veut voir les messages reçus' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Liste des messages reçus',
    schema: {
      example: [
        {
          id: 2,
          content: 'Salut, je vais bien !',
          createdAt: '2024-01-15T10:32:00.000Z',
          isRead: false,
          sender: {
            id: 3,
            pseudo: 'pierre_durand'
          }
        }
      ]
    }
  })
  async getReceivedMessages(@Param('userId', ParseIntPipe) userId: number) {
    return this.chatService.getReceivedMessages(userId);
  }
}