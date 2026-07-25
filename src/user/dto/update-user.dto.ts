import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from 'node_modules/@nestjs/swagger/dist/decorators/api-property.decorator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty({
    description: "Pseudo de l'utilisateur",
        example: "JohnDoe",
        })
        @IsString()
        pseudo!: string;
    
        @ApiProperty({
            description: "Adresse email de l'utilisateur",
            example: "user@example.com",
        })
        @IsEmail({}, { message: "Email invalide" })
        email!: string;
    
        @ApiProperty({
            description: "Mot de passe de l'utilisateur",
            example: "password123",
        })
        @IsString()
        password!: string;
}
