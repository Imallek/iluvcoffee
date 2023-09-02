/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception/http-exception.filter';
import { ApiKeyGuard } from './common/guards/api-key/api-key.guard';

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

  // as this exception filter dont have any provider dependency we can add it here in main.ts file
  app.useGlobalFilters(new HttpExceptionFilter())

  // Not registering it here because it has a constructor that takes 2 dependencies, 
  // Registering it here is outside of any NestJs module context, so we cannot benefit from DI
  // I have made another common module and registered it there so that DI could work and 
  // dependencies in the constructor could be injected
  // app.useGlobalGuards(new ApiKeyGuard())
  await app.listen(3001);
}
bootstrap();
