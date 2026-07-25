import {
  Controller,
  Post,
  Body,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Inscrire un nouvel utilisateur' })
  @ApiBody({
    type: RegisterDto,
    examples: {
      default: {
        summary: 'Exemple d\'inscription',
        value: {
          pseudo: 'votre pseudo',
          email: 'user@example.com',
          password: 'password123',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Utilisateur créé avec succès.' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Connexion (Retourne Access Token & Refresh Token)' })
  @ApiBody({
    type: LoginDto,
    examples: {
      default: {
        summary: 'Exemple de connexion',
        value: {
          email: 'user@example.com',
          password: 'password123',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Connexion réussie.' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @Get('refresh')
  @ApiOperation({ summary: 'Générer un nouveau refresh token à partir du token d’accès' })
  @ApiResponse({ status: 200, description: 'Nouveaux tokens générés.' })
  async refresh(@Req() req: any) {
    return this.authService.refresh(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('profile')
  @ApiOperation({ summary: 'Récupère le profil de l’utilisateur authentifié' })
  @ApiResponse({ status: 200, description: 'Profil utilisateur renvoyé.' })
  async profile(@Req() req: any) {
    const { password, ...userData } = req.user;
    return userData;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post('logout')
  @ApiOperation({ summary: 'Déconnexion utilisateur (Révoquer le Refresh Token)' })
  async logout(@Req() req: any) {
    await this.authService.revokeRefresh(req.user.id);
    return { ok: true, message: 'Déconnecté avec succès' };
  }
}