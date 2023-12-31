/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, SetMetadata, UsePipes, ValidationPipe } from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { PaginationQueryDto } from './../common/dto/pagination-query.dto/pagination-query.dto';
import { Public } from './../common/decorators/public.decorator';
import { ParseIntPipe } from './../common/pipes/parse-int/parse-int.pipe';
import { Protocol } from './../common/decorators/protocol.decorator';
import { ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';

/**
 We can use pipes on specific controller as well
 Other building blocks are also available on controller level, like useGuards, useInteceptors and useFitlers
 */
// @UsePipes(ValidationPipe)		// can toke comma separated list of classes
@ApiTags('coffees')
@Controller('coffees')
export class CoffeesController {

	constructor(private readonly coffeesService: CoffeesService) { }

	/**
	 Pipes can also be method scope as following
	 */
	// @UsePipes(ValidationPipe)

	// following is an example of adding custom/another response to the route
	// @ApiForbiddenResponse({ description: 'Forbidden' })
	@Public()
	@Get()
	async findAll(@Protocol('https') protocol: string, @Query() paginationQuery: PaginationQueryDto) {
		console.log({ protocol });
		const { limit, offset } = paginationQuery;
		return this.coffeesService.findAll(paginationQuery);
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: string) {
		return this.coffeesService.findOne(id);
	}

	@Post('')
	@HttpCode(HttpStatus.CREATED)
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
