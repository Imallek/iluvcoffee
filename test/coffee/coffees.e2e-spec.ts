/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CoffeesModule } from '../../src/coffees/coffees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateCoffeeDto } from 'src/coffees/dto/create-coffee.dto';

describe('[Feature] Coffees - /coffees', () => {
	const coffee = {
		name: 'Shipwreck Roast',
		brand: 'Buddy brew',
		flavors: ['chocolate', 'vanilla']
	}

	let app: INestApplication;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [
				CoffeesModule,
				TypeOrmModule.forRoot({
					type: 'postgres',
					host: 'localhost',
					port: 5433,
					username: 'postgres',
					password: 'pass123',
					database: 'postgres',
					autoLoadEntities: true,
					synchronize: true
				})
			],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('Create [POST /]', () => {
		return request(app.getHttpServer())
			.post('/coffees')
			.send(coffee as CreateCoffeeDto)
			.expect(HttpStatus.CREATED)
			.then(({ body }) => {
				const expectedCoffee = expect.objectContaining({
					...coffee,
					flavors: expect.arrayContaining(
						coffee.flavors.map(name => expect.objectContaining({ name }))
					)
				});
				expect(body).toEqual(expectedCoffee);
			})
	});
	it.todo('Get all [GET /]');
	it.todo('Get one [GET /:id]');
	it.todo('Update one [PATCH /:id]');
	it.todo('Delete one [DELETE /:id]');

	afterAll(async () => {
		// to call onModuleDestroy and onModuleShutdown, to terminate all connections in out application
		await app.close();
	});
});
