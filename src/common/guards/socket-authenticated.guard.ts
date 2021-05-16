import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from '../interfaces/request.interface';

@Injectable()
export class SocketAuthenticatedGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {
  }

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.get<boolean>( 'isPublic', context.getHandler());

    if ( isPublic ) {
      return true;
    }

    const request: Request = context.switchToWs().getClient().request;

    return request.isAuthenticated();
  }
}
