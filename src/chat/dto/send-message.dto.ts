import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class SendMessageDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  senderId!: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  @IsPositive()
  recipientId!: number;

  @ApiProperty({ example: 'Bonjour, comment ça va ?' })
  @IsString()
  @IsNotEmpty()
  content!: string;
}
