/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CoffeesController } from './coffees.controller';
import { Coffee } from './entities/coffee.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Flavor } from './entities/flavor.entity';
import { Event } from 'src/events/entities/event.entity/event.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
	providers: [CoffeesService],
	controllers: [CoffeesController]
})
export class CoffeesModule { }
