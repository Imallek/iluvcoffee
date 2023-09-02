/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto/pagination-query.dto';

/**
 We can use pipes on specific controller as well
 Other building blocks are also available on controller level, like useGuards, useInteceptors and useFitlers
 */
// @UsePipes(ValidationPipe)		// can toke comma separated list of classes
@Controller('coffees')
export class CoffeesController {

	constructor(private readonly coffeesService: CoffeesService) { }

	/**
	 Pipes can also be method scope as following
	 */
	// @UsePipes(ValidationPipe)
	@Get()
	findAll(@Query() paginationQuery: PaginationQueryDto) {
		const { limit, offset } = paginationQuery;
		return this.coffeesService.findAll(paginationQuery);
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.coffeesService.findOne(id);
	}

	@Post('')
	@HttpCode(HttpStatus.GONE)
	create(@Body() createCoffeeDto: CreateCoffeeDto) {
		return this.coffeesService.create(createCoffeeDto);
	}

	/**
	 We can use param base pipes as well as following
	update(@Param('id') id: string, @Body(ValidationPipe) updateCoffeeDto: UpdateCoffeeDto){...}
	 */
	@Patch(':id')
	update(@Param('id') id: string, @Body() updateCoffeeDto: UpdateCoffeeDto) {
		return this.coffeesService.udpate(id, updateCoffeeDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.coffeesService.remove(id);
	}
}
