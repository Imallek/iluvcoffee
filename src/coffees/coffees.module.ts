/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CoffeesController } from './coffees.controller';
import { Coffee } from './entities/coffee.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Flavor } from './entities/flavor.entity';
import { Event } from 'src/events/entities/event.entity/event.entity';
import { COFFEE_BRANDS } from './coffees.constants';

class MockCoffeeService { }

class ConfigService { }
class DevelopmentConfigService { }
class ProductionConfigService { }

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
	},
	 */
	{
		provide: COFFEE_BRANDS,
		useValue: ['buddy brew', 'nescafe']
	},
	{
		provide: ConfigService,
		useClass: process.env.NODE_ENV === 'development' ? DevelopmentConfigService : ProductionConfigService,
	}
	],
	controllers: [CoffeesController],
	exports: [CoffeesService]
})
export class CoffeesModule { }
