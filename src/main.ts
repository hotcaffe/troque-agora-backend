import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './filters/http-exception-filter.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: {
    origin: true,
    credentials: true,
    methods: 'OPTIONS,CONNECT,GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['content-type'],
    exposedHeaders: 'Set-Cookie'
  }});
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  await app.listen(3001);
}
bootstrap();
