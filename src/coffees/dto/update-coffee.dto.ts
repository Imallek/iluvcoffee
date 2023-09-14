/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import { PartialType } from "@nestjs/swagger";
import { CreateCoffeeDto } from "./create-coffee.dto";

export class UpdateCoffeeDto extends PartialType(CreateCoffeeDto) {
}
