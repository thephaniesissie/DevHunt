import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class CreateBadgeEarnedDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  projectId: number;

  @ApiProperty({ example: 3 })
  @IsInt()
  @IsPositive()
  badgeId: number;
}