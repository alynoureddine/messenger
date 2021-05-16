import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as passport from 'passport';
import * as session from 'express-session';
import { ConfigService } from '@nestjs/config';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { AuthenticatedGuard } from './common/guards/authenticated.guard';
import { SocketGateway } from './socket/socket.gateway';
import { Server, Socket } from 'socket.io';
require('ts-node/register');

const MongoDBStore = require('connect-mongodb-session')(session);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);

  const sessionMiddleware = session({
    secret: configService.get('SESSION_SECRET'),
    resave: false,
    saveUninitialized: false,
    store: new MongoDBStore({
      uri: configService.get('MONGODB_URI'),
      collection: configService.get('SESSION_COLLECTION'),
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
  });

  app.use(sessionMiddleware);

  const passportInit = passport.initialize();
  const passportSession = passport.session();

  app.use(passportInit);
  app.use(passportSession);

  app.useGlobalGuards(new AuthenticatedGuard(app.get(Reflector)));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(configService.get('PORT'));

  // add session and passport middleware for the socket gateway
  const socketServer: Server = app.get(SocketGateway).server;

  socketServer.use((socket: Socket, next) => {
    sessionMiddleware(socket.request, socket.request.res || {}, next);
  });

  socketServer.use((socket: Socket, next) => {
    passportInit(socket.request, socket.request.res || {}, next);
  });

  socketServer.use((socket: Socket, next) => {
    passportSession(socket.request, socket.request.res || {}, next);
  });
}
bootstrap();
