import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { intersection, isEmpty } from 'lodash';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const request = context.switchToHttp().getRequest();

    if (request?.user) {
      // check if the user roles array contains at least one role from the 'roles' array
      const hasMatchingRole = !isEmpty(intersection(request.user.roles, roles));

      return hasMatchingRole;
    }

    return false;
  }
}
