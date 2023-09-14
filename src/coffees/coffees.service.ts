/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto/pagination-query.dto';

@Injectable()
export class CoffeesService {
	constructor(
		@InjectModel(Coffee.name) private readonly coffeeModel: Model<Coffee>
	) {

	}

	findAll(paginationQuery: PaginationQueryDto) {
		const { limit, offset } = paginationQuery;
		return this.coffeeModel.find().skip(offset).limit(limit).exec();
	}

	async findOne(id: string) {
		const coffee = await this.coffeeModel.findOne({ _id: id }).exec();
		if (!coffee) {
			throw new NotFoundException(`Coffee #${id} could not be found`);
		}
		return coffee;
	}

	create(createCoffeeDTO: CreateCoffeeDto) {
		const coffee = new this.coffeeModel(createCoffeeDTO);
		return coffee.save();
	}

	udpate(id: string, udpateCoffeeDTO: UpdateCoffeeDto) {
		const existingCoffee = this.coffeeModel
			.findOneAndUpdate({ _id: id }, { $set: udpateCoffeeDTO }, { new: true })
			.exec();
		if (!existingCoffee) {
			throw new NotFoundException(`Coffee #${id} not found`);
		}
		return existingCoffee;
	}

	async remove(id: string) {
		const coffee = await this.findOne(id);
		return coffee.deleteOne();
	}
}
