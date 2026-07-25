import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Adresse email de l\'utilisateur',
    required: true,
  })
  @IsEmail({}, { message: 'Email invalide' })
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: 'sissie123',
    description: 'Mot de passe',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password!: string;
}