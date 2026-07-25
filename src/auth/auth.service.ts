import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  private refreshTokens = new Map<number, string>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async register(registerDto: any) {
    const existingUser = await this.userService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Cet email est déjà utilisé.');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.userService.create({
      ...registerDto,
      password: hashedPassword,
    });

    return {
      id: user.id,
      pseudo: user.pseudo,
      email: user.email,
    };
  }

  async validateUser(email: string, pass: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) return null;

    const passwordMatches = await bcrypt.compare(pass, user.password);
    if (!passwordMatches) return null;

    const { password, ...result } = user;
    return result;
  }

  async login(loginDto: any) {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect.');
    }

    const passwordMatches = await bcrypt.compare(loginDto.password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Email ou mot de passe incorrect.');
    }

    return this.generateTokens(user);
  }

  async refresh(user: any) {
    if (!user || !user.id) {
      throw new UnauthorizedException('Utilisateur non authentifié.');
    }

    const dbUser = await this.userService.findOne(user.id);
    if (!dbUser) {
      throw new UnauthorizedException('Utilisateur introuvable.');
    }

    return this.generateTokens(dbUser);
  }

  async revokeRefresh(userId: number) {
    this.refreshTokens.delete(userId);
  }

  private async generateTokens(user: any) {
    const payload = { sub: user.id, email: user.email, pseudo: user.pseudo };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Sauvegarde du token rafraîchi pour cet utilisateur
    this.refreshTokens.set(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        pseudo: user.pseudo,
      },
    };
  }
}