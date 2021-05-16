import { Injectable, ValidationError, ValidationPipe } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class SocketValidationPipe extends ValidationPipe {
  protected exceptionFactory: (errors: ValidationError[]) => any = (validationErrors: ValidationError[] = []) => {
    return new WsException(validationErrors);
  };
}
