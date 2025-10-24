import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('Acesso negado. Autenticação necessária.');
    }

    const hasRole = requiredRoles.some((role) => user.tipo === role);

    if (!hasRole) {
      throw new ForbiddenException(
        `Acesso negado. Esta operação requer uma das seguintes permissões: ${requiredRoles.join(', ')}. Seu perfil atual: ${user.tipo}`,
      );
    }

    return true;
  }
}
