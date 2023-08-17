/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@Injectable()
export class CoffeesService {
	private coffees: Coffee[] = [{
		id: 1,
		brand: 'Buddy Brew',
		name: 'Shipwrek Rock',
		flavors: ['chocolate', 'vanilla']
	}];

	findAll() {
		return this.coffees;
	}

	findOne(id: string) {
		// throw 'Some random Exception that would be handled by exception layer in NestJS, API would get 500 error though.'
		const coffee = this.coffees.find(item => item.id === +id);
		if (!coffee) {
			// throw new HttpException(`Coffee #${id} could not be found`, HttpStatus.NOT_FOUND);
			throw new NotFoundException(`Coffee #${id} could not be found`);
		}
		return coffee;
	}

	create(createCoffeeDTO: any) {
		this.coffees.push(createCoffeeDTO);
	}

	udpate(id: string, udpateCoffeeDTO: UpdateCoffeeDto) {
		const existingCoffee = this.findOne(id);
		if (existingCoffee) {
			// update
		}
	}

	remove(id: string) {
		const coffeeIndex = this.coffees.findIndex(item => item.id === +id);
		if (coffeeIndex > 0) {
			this.coffees.splice(coffeeIndex, 1);
		}
	}
}
