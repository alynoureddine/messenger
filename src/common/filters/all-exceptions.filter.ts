import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

@Catch()
export class AllSocketExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    if (exception instanceof HttpException) {
      new BaseWsExceptionFilter().catch(
        new WsException((exception as any).response.message),
        host,
      );

      return;
    }

    new BaseWsExceptionFilter().catch(exception, host)
  }
}
