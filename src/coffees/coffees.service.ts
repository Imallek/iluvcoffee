/* eslint-disable prettier/prettier */
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';

@Injectable()
export class CoffeesService {
	private coffees: Coffee[] = [{
		id: 1,
		brand: 'Buddy Brew',
		name: 'Shipwrek Rock',
		flavors: ['chocolate', 'vanilla']
	}];

	/**
	 * 
	 * Can also extends repository and define custom methods in that as well
	 * @EntityRepository(Image)
	 * export class ImageRepository extends Repository<Image> {}
	 */
	constructor(
		@InjectRepository(Coffee)
		private readonly coffeeRepository: Repository<Coffee>) {

	}

	findAll() {
		return this.coffeeRepository.find();
	}

	async findOne(id: string) {
		// throw 'Some random Exception that would be handled by exception layer in NestJS, API would get 500 error though.'
		const coffee = await this.coffeeRepository.findOne({ where: { id: +id } });
		if (!coffee) {
			// throw new HttpException(`Coffee #${id} could not be found`, HttpStatus.NOT_FOUND);
			throw new NotFoundException(`Coffee #${id} could not be found`);
		}
		return coffee;
	}

	create(createCoffeeDTO: CreateCoffeeDto) {
		const coffee = this.coffeeRepository.create(createCoffeeDTO);
		return this.coffeeRepository.save(coffee);
	}

	async udpate(id: string, updateCoffeeDTO: UpdateCoffeeDto) {
		const existingCoffee = await this.coffeeRepository.preload({
			id: +id,
			...updateCoffeeDTO
		});
		if (!existingCoffee) {
			throw new NotFoundException(`Coffee #${id} was not found.`);
		}
		return this.coffeeRepository.save(existingCoffee);
	}

	async remove(id: string) {
		const coffee = await this.findOne(id);
		return this.coffeeRepository.remove(coffee);
	}
}
