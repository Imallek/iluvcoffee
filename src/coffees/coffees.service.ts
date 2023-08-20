/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Connection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { Flavor } from './entities/flavor.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto/pagination-query.dto';
import { Event } from 'src/events/entities/event.entity/event.entity';


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
		private readonly flavorRepository: Repository<Flavor>,
		private readonly connection: Connection
	) {

	}

	findAll(paginationQuery: PaginationQueryDto) {
		const { offset, limit } = paginationQuery;
		return this.coffeeRepository.find({
			relations: ['flavors'],
			skip: offset,
			take: limit
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

	async recommendCoffee(coffee: Coffee) {
		const queryRunner = this.connection.createQueryRunner();

		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			coffee.recommendations++;

			const recommendEvent = new Event();
			recommendEvent.name = 'recommend_coffee';
			recommendEvent.type = 'coffee';
			recommendEvent.payload = { coffeeId: coffee.id };

			await queryRunner.manager.save(coffee);
			await queryRunner.manager.save(recommendEvent);

			await queryRunner.commitTransaction();
		} catch (err) {
			await queryRunner.rollbackTransaction();
		} finally {
			await queryRunner.release();
		}
	}

	private async preloadFlavorByName(name: string): Promise<Flavor> {
		const existingFlavor = await this.flavorRepository.findOne({ where: { name } });
		if (existingFlavor) {
			return existingFlavor;
		}
		return this.flavorRepository.create({ name });
	}
}
