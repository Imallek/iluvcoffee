/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CoffeesController } from './coffees.controller';
import { Coffee } from './entities/coffee.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	imports: [TypeOrmModule.forFeature([Coffee])],
	providers: [CoffeesService],
	controllers: [CoffeesController]
})
export class CoffeesModule { }
