import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as passport from 'passport';
import * as session from 'express-session';
import { ConfigService } from '@nestjs/config';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { AuthenticatedGuard } from './common/guards/authenticated.guard';

const MongoDBStore = require('connect-mongodb-session')(session);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    session({
      secret: app.get(ConfigService).get('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
      store: new MongoDBStore({
        uri: app.get(ConfigService).get('MONGODB_URI'),
        collection: app.get(ConfigService).get('SESSION_COLLECTION'),
      }),
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.useGlobalGuards(new AuthenticatedGuard(app.get(Reflector)));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.listen(3100);
}
bootstrap();
