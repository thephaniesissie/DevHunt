import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';
import { IsOptional, IsUrl, IsString, MaxLength } from 'class-validator';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @IsString()
  @IsOptional()
  publicDescription?: string;

  @IsUrl()
  @IsOptional()
  @MaxLength(255)
  projectLink?: string;

  @IsUrl()
  @IsOptional()
  @MaxLength(255)
  docLink?: string;

  @IsUrl()
  @IsOptional()
  @MaxLength(255)
  coverImageUrl?: string;
}