import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUrl, IsOptional, MaxLength } from 'class-validator';

export class PublishOpenRelaisDto {
  @ApiProperty({ example: 'Projet Java arrêté à 60% de la structure MVC...' })
  @IsString()
  @IsNotEmpty()
  publicDescription: string;

  @ApiProperty({ example: 'https://github.com/soa/mon-projet-java' })
  @IsUrl()
  @MaxLength(255)
  projectLink: string;

  @ApiProperty({ example: 'https://cdn.elan.app/covers/abc123.png' })
  @IsUrl()
  @MaxLength(255)
  coverImageUrl: string;

  @ApiPropertyOptional({ example: 'https://notion.so/roadmap-java' })
  @IsUrl()
  @MaxLength(255)
  @IsOptional()
  docLink?: string;
}