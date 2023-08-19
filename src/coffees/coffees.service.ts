/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { Flavor } from './entities/flavor.entity';

@Injectable()
export class CoffeesService {
	/**
	 * 
	 * Can also extends repository and define custom methods in that as well
	 * @EntityRepository(Image)
	 * export class ImageRepository extends Repository<Image> {}
	 */
	constructor(
		@InjectRepository(Coffee)
		private readonly coffeeRepository: Repository<Coffee>,
		@InjectRepository(Flavor)
		private readonly flavorRepository: Repository<Flavor>
	) {

	}

	findAll() {
		return this.coffeeRepository.find({
			relations: ['flavors']
		});
	}

	async findOne(id: string) {
		// throw 'Some random Exception that would be handled by exception layer in NestJS, API would get 500 error though.'
		const coffee = await this.coffeeRepository.findOne({ where: { id: +id }, relations: ['flavors'] });
		if (!coffee) {
			// throw new HttpException(`Coffee #${id} could not be found`, HttpStatus.NOT_FOUND);
			throw new NotFoundException(`Coffee #${id} could not be found`);
		}
		return coffee;
	}

	async create(createCoffeeDTO: CreateCoffeeDto) {
		const flavors = await Promise.all(
			createCoffeeDTO.flavors.map((name) => this.preloadFlavorByName(name))
		)
		const coffee = this.coffeeRepository.create({
			...createCoffeeDTO,
			flavors
		});
		return this.coffeeRepository.save(coffee);
	}

	async udpate(id: string, updateCoffeeDTO: UpdateCoffeeDto) {
		const flavors = updateCoffeeDTO.flavors && (await Promise.all(
			updateCoffeeDTO.flavors.map((name) => this.preloadFlavorByName(name))
		))
		const existingCoffee = await this.coffeeRepository.preload({
			id: +id,
			...updateCoffeeDTO,
			flavors
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

	private async preloadFlavorByName(name: string): Promise<Flavor> {
		const existingFlavor = await this.flavorRepository.findOne({ where: { name } });
		if (existingFlavor) {
			return existingFlavor;
		}
		return this.flavorRepository.create({ name });
	}
}
