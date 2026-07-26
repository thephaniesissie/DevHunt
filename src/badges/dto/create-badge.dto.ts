import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateBadgeDto {
  @ApiProperty({ example: 'PASSEUR_ELAN' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  code: string;

  @ApiProperty({ example: "Passeur d'Élan" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: '3 validations consécutives' })
  @IsString()
  @IsNotEmpty()
  description: string;
}