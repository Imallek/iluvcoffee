/* eslint-disable prettier/prettier */
import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Connection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { Flavor } from './entities/flavor.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto/pagination-query.dto';
import { Event } from '../events/entities/event.entity/event.entity';
import { COFFEE_BRANDS, COFFEE_BRANDS2, COFFEE_BRANDS3 } from './coffees.constants';


@Injectable()			// @Injectable() with no arguments Equivalent to @Injectable({scope: Scope.DEFAULT}) // with default being Singleton scope
/**
 Other scope are Transient and Request_Scoped
 Transient ({ scope: Scope.TRANSIENT }) providers are not shared accross consumers, Each consumer that injects a Transient provider, will receive a new 
 dedicated instance of that provider

 Request_Scoped ({scope: Scope.REQUEST}) provides a new instance of provider exclusively for each request, instance is automatically garbage collected after
 the request has completed the processing
 In NEST scopes bubble up the injection chain, This means that if coffee controller depends upon the coffeeservice which is request scoped, the coffeecontroller implicitly 
 becomes the request scoped as well
 In REQUEST scoped providers, can inject the original request object, to get the cookies, headers etc as follows 
 constructor(@Inject(REQUEST) private readonly request: Request)
 we can do above thing in coffeecontroller and coffeeservice, as we discussed that in NEST scopes bubble up the injection chain, so coffeecontroller is also request scoped
 
 Making a provider request scoped effects performance, normally scope should be singleton unless it MUST be some other scope
 */
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
		private readonly connection: Connection,
		@Inject(COFFEE_BRANDS)
		private readonly coffeeBrands: string[],
		@Inject(COFFEE_BRANDS2)
		private readonly coffeeBrands2: string[],
		@Inject(COFFEE_BRANDS3)
		private readonly coffeeBrands3: string[]
	) {
		console.log({ coffeeBrands });
		console.log({ coffeeBrands2 });
		console.log({ coffeeBrands3 });
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
