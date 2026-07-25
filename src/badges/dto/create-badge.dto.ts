import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class CreateBadgeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  code: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}