import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as passport from 'passport';
import * as session from 'express-session';
import { ConfigService } from '@nestjs/config';
import { UserService } from './users/user.service';
import { ClassSerializerInterceptor } from '@nestjs/common';

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

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.listen(3100);
}
bootstrap();
