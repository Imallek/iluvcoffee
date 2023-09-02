/* eslint-disable prettier/prettier */
import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeeRatingModule } from './coffee-rating/coffee-rating.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { APP_PIPE } from '@nestjs/core';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DATABASE_HOST: Joi.required(),
        DATABASE_PORT: Joi.number().default(5432),
      })
    }),
    CoffeesModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true, // Dont enable this option for production
    }), CoffeeRatingModule, DatabaseModule, CommonModule],
  controllers: [AppController],
  providers: [AppService,
    // {
    // This APP_PIPE provider is a special token imported from nest/core
    // Providing validation pipe like this, lets NestJS instantiate the pipe within the scope of App.module and once created, registers it as a global pipe (because we are doing it in parent of all modules)
    // There are also corresponding tokens for other building blocks, like APP_GAURD, APP_FILTER, APP_INTERCEPTOR etc
    // provide: APP_PIPE,
    // useClass: ValidationPipe
    // }
  ],
})
export class AppModule { }
