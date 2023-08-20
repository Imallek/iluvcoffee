/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CoffeesController } from './coffees.controller';
import { Coffee } from './entities/coffee.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Flavor } from './entities/flavor.entity';
import { Event } from 'src/events/entities/event.entity/event.entity';

class MockCoffeeService { }
@Module({
	imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
	providers: [{
		provide: CoffeesService,
		useClass: CoffeesService,
	},
		/**
		{
			provide: CoffeesService,
			useValue: new MockCoffeeService(),
			// Now whenever the CoffeeService token is resolved, our MockCoffeeService class would be provided by Dependency injection
		}
		 */
	],
	controllers: [CoffeesController],
	exports: [CoffeesService]
})
export class CoffeesModule { }
