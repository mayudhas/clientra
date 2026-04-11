import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../enums/user-role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    if (!user || !user.role) {
        return false;
    }

    // 1. Super Admin bypasses all role checks
    if (user.role === UserRole.SUPER_ADMIN || user.role === 'super_admin') {
      return true;
    }

    // 2. Exact match (using String casting for robustness)
    const hasRole = requiredRoles.some(role => String(role) === String(user.role));
    if (hasRole) {
      return true;
    }

    // 3. Hierarchy logic: Admin inherits Member permissions
    if ((user.role === UserRole.ADMIN || user.role === 'admin') && 
        requiredRoles.some(role => String(role) === UserRole.MEMBER)) {
      return true;
    }

    return false;
  }
}
