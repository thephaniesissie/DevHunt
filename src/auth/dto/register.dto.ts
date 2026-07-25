import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'Votre pseudo',
    description: 'Pseudo de l\'utilisateur',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  pseudo!: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Adresse email unique de l\'utilisateur',
    required: true,
  })
  @IsEmail({}, { message: 'Email invalide' })
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: 'password123',
    description: 'Mot de passe sécurisé (minimum 6 caractères)',
    minLength: 6,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' })
  password!: string;
}