import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryPublicProjectsDto {
  @ApiPropertyOptional({ example: 'java', description: 'Recherche par mot-clé (titre/description)' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ enum: ['recent', 'popular'], example: 'recent' })
  @IsIn(['recent', 'popular'])
  @IsOptional()
  sortBy?: 'recent' | 'popular' = 'recent';

  @ApiPropertyOptional({ example: 1, default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, default: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 10;
}