import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {
  }

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.get<boolean>( 'isPublic', context.getHandler());

    if ( isPublic ) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    return request.isAuthenticated();
  }
}
