/* eslint-disable prettier/prettier */
import { Injectable, Module } from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CoffeesController } from './coffees.controller';
import { Coffee } from './entities/coffee.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Flavor } from './entities/flavor.entity';
import { Event } from 'src/events/entities/event.entity/event.entity';
import { COFFEE_BRANDS, COFFEE_BRANDS2, COFFEE_BRANDS3 } from './coffees.constants';
import { Connection } from 'typeorm';

class MockCoffeeService { }

class ConfigService { }
class DevelopmentConfigService { }
class ProductionConfigService { }

@Injectable()
export class CoffeeBrandsFactory {
	create() {
		return ['buddy brew', 'nescafe'];
	}
}

@Module({
	imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
	providers: [CoffeeBrandsFactory, {
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
		},
		{
			provide: COFFEE_BRANDS2,
			useFactory: (brandsFactory: CoffeeBrandsFactory) => brandsFactory.create(),
			inject: [CoffeeBrandsFactory]
		},
		{
			provide: COFFEE_BRANDS3,
			useFactory: async (connection: Connection): Promise<string[]> => {
				const coffeebrands = await Promise.resolve(['buddy brew', 'nescafe']);
				return coffeebrands;
			},
			inject: [CoffeeBrandsFactory]
		}
	],
	controllers: [CoffeesController],
	exports: [CoffeesService]
})
export class CoffeesModule { }
