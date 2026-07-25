// src/chat/dto/message-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

class UserPreviewDto {
  @ApiProperty({ example: 1, description: 'ID de l\'utilisateur' })
  id!: number;

  @ApiProperty({ example: 'jean_dupont', description: 'Pseudo de l\'utilisateur' })
  pseudo!: string;
}

export class MessageResponseDto {
  @ApiProperty({ example: 1, description: 'ID du message' })
  id!: number;

  @ApiProperty({ example: 'Bonjour, comment ça va ?', description: 'Contenu du message' })
  content!: string;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z', description: 'Date de création' })
  createdAt!: Date;

  @ApiProperty({ example: true, description: 'Message lu ou non' })
  isRead!: boolean;

  @ApiProperty({ type: UserPreviewDto, description: 'Destinataire du message' })
  recipient?: UserPreviewDto;

  @ApiProperty({ type: UserPreviewDto, description: 'Expéditeur du message' })
  sender?: UserPreviewDto;
}