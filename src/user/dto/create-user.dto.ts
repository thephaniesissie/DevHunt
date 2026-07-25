import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class CreateUserDto {
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