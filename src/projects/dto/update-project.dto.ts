import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';
import { IsOptional, IsUrl, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @ApiPropertyOptional({ example: 'Apprendre Java' })
  @IsString()
  @IsOptional()
  publicDescription?: string;

  @ApiPropertyOptional({ example: 'https://github.com/tokijr/mon-projet' })
  @IsUrl()
  @IsOptional()
  @MaxLength(255)
  projectLink?: string;

  @ApiPropertyOptional({ example: 'https://mon-projet-docs.vercel.app' })
  @IsUrl()
  @IsOptional()
  @MaxLength(255)
  docLink?: string;

  @ApiPropertyOptional({ example: 'https://mon-projet.com/cover.png' })
  @IsUrl()
  @IsOptional()
  @MaxLength(255)
  coverImageUrl?: string;
}