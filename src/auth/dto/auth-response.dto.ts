import { ApiProperty } from '@nestjs/swagger';

class UserResponseDto {
  @ApiProperty({ example: 1, description: 'ID de l\'utilisateur' })
  id!: number;

  @ApiProperty({ example: 'user@example.com', description: 'Email de l\'utilisateur' })
  email!: string;
}

export class LoginResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Token JWT généré après connexion réussie',
  })
  access_token!: string;

  @ApiProperty({ type: UserResponseDto })
  user!: UserResponseDto;
}