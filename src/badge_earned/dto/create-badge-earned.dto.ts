import { IsInt, IsPositive, IsOptional, IsString, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBadgeEarnedDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  badgeId!: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  projectId!: number;

  @ApiProperty({ example: 'A complété 30 jours de travail', required: false })
  @IsOptional()
  @IsString()
  achievementContext?: string;

  @ApiProperty({ example: { streak: 30 }, required: false })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}