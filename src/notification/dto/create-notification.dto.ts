import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { ApiProperty } from 'node_modules/@nestjs/swagger/dist/decorators/api-property.decorator';

export class CreateNotificationDto {
  @ApiProperty({ example: 2 })
  @IsInt()
  @IsPositive()
  userId!: number;

  @ApiProperty({ example: 'Nouveau message 💬' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'Vous avez reçu un nouveau message...' })
  @IsString()
  @IsNotEmpty()
  message!: string;
}