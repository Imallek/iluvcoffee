/* eslint-disable prettier/prettier */
import { Type } from "class-transformer";
import { IsOptional, IsPositive } from "class-validator";

export class PaginationQueryDto {
	@IsOptional()
	@IsPositive()
	// @Type(() => Number)   // commenting it because we're using config options in main.ts
	limit: number;

	@IsOptional()
	@IsPositive()
	// @Type(() => Number) // commenting it because we're using config options in main.ts
	offset: number;
}
