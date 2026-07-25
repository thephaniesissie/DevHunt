import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  // handleRequest permet de voir la VRAIE raison du 401
  // (token absent, expiré, signature invalide, user introuvable...)
  // au lieu du message générique "Unauthorized" que Nest renvoie par défaut.
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers?.authorization;
      const reason = info?.message || err?.message || 'Utilisateur non authentifié';

      this.logger.warn(
        `Accès refusé sur ${request.method} ${request.url} — raison: ${reason} — header présent: ${!!authHeader}`,
      );

      throw err || new UnauthorizedException(reason);
    }
    return user;
  }
}