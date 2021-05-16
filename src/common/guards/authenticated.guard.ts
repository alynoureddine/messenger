import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from '../interfaces/request.interface';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {
  }

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.get<boolean>( 'isPublic', context.getHandler());

    if ( isPublic ) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    return request.isAuthenticated();
  }
}
