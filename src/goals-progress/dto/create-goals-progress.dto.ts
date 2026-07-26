import { IsInt, IsPositive, IsOptional, IsString, IsBoolean, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGoalsProgressDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  projectId!: number;

  @ApiProperty({ example: 30 })
  @IsInt()
  @IsPositive()
  minutesSpent!: number;

  @ApiProperty({ example: 'Séance de travail sur la phase 1', required: false })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isValidated?: boolean;

  @ApiProperty({ example: { sessionType: 'focus' }, required: false })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}