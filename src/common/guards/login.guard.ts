// src/common/guards/login.guard.ts
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from '../interfaces/request.interface';

@Injectable()
export class LoginGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext) {
    const result: boolean = (await super.canActivate(context)) as boolean;
    const request: Request = context.switchToHttp().getRequest();
    await super.logIn(request);
    return result;
  }
}
