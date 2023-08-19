/* eslint-disable prettier/prettier */
import { Type } from "class-transformer";
import { IsOptional, IsPositive } from "class-validator";


export class PaginationQueryDto {
	@IsOptional()
	@IsPositive()
	// @Type(() => Number)		// setting this in Global validation, so that we dont have to set types like this
	limit: number;

	@IsOptional()
	// @Type(() => Number)
	offset: number;
}
