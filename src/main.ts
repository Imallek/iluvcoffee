/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   We have used pipes globally here,
   We also have GlobalFilters, GlobalGuards, GlobalInterceptors etc have available here

   We've used GlobalPipes here, one limitation of using pipes here like this is that we cannot inject any dependency here
   since we are setting it up outside the context of any NestJS module

   */

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transformOptions: {
      enableImplicitConversion: true
    }
  }));
  await app.listen(3001);
}
bootstrap();
