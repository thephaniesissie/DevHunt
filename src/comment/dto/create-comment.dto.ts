import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  projectId!: number;

  @ApiProperty({ example: 'Super projet ! Bravo !' })
  @IsString()
  @IsNotEmpty()
  content!: string;

  @ApiProperty({ example: 2, required: false })
  @IsOptional()
  @IsInt()
  @IsPositive()
  parentCommentId?: number;

  @ApiProperty({ example: { rating: 5 }, required: false })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}