import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsEnum,
  IsInt,
  Min,
  IsUUID,
} from 'class-validator';
import { FrequencyType } from '../enums/frequency-type.enum';

export class CreateProjectDto {
  @ApiProperty({ example: 'Apprendre Java', maxLength: 150 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title: string;

  @ApiPropertyOptional({ example: 'Apprendre les bases de Java en 30 jours' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: FrequencyType, example: FrequencyType.DAILY })
  @IsEnum(FrequencyType)
  frequencyType: FrequencyType;

  @ApiProperty({ example: 30 })
  @IsInt()
  @Min(1)
  frequencyTargetMinutes: number;

  @IsUUID()
  @IsOptional()
  parentProjectId?: string;
}