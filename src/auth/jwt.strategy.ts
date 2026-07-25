import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private static readonly logger = new Logger('JwtStrategy');

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    // IMPORTANT: ce secret doit être EXACTEMENT le même que celui utilisé
    // pour signer les tokens dans AuthModule (JwtModule.register/registerAsync)
    // et dans SocketGateway. Un seul et même JWT_SECRET dans le .env.
    const secret = configService.get<string>('JWT_SECRET');

    if (!secret) {
      // On échoue au démarrage plutôt que de tomber sur un fallback
      // silencieux qui ne correspondra jamais au secret de signature.
      JwtStrategy.logger.error(
        'JWT_SECRET est manquant dans la configuration (.env). ' +
          'Tous les tokens seront rejetés.',
      );
      throw new Error('JWT_SECRET manquant dans la configuration (.env)');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findOne(payload.sub);
    if (!user) return null; // Nest transforme null en 401 automatiquement
    const { password, ...result } = user;
    return result;
  }
}