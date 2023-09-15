/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CoffeesController } from './coffees.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Coffee, CoffeeSchema } from './entities/coffee.entity';
import { EventSchema } from 'src/events/entities/event.entity/event.entity';

@Module({
	providers: [CoffeesService],
	controllers: [CoffeesController],
	imports: [
		MongooseModule.forFeature([
			{
				name: Coffee.name,
				schema: CoffeeSchema
			},
			{
				name: Event.name,
				schema: EventSchema
			},
		])
	]
})
export class CoffeesModule { }
