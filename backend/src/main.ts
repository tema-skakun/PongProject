import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import * as cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import { AllExceptionsFilter } from './exceptionFilter/exceptionFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true});
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe({
	whitelist: true,
  }
  ));
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
  app.use(cookieParser());

app.use(cors((req, callback) => {
	// Replace this with your own logic to validate the request's origin.
	// For example, you can check against a list of allowed origins.
	const origin = req.headers.origin;
	callback(null, { origin: origin, credentials: true });
}));

  await app.listen(6969, '0.0.0.0');
}

bootstrap()
