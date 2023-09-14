/* eslint-disable prettier/prettier */

import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Flavor } from "./flavor.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Coffee { // sql table generated for this would be lower-case classname e.g coffee, can use @Entity('somedifferentname') for some different name
	@ApiProperty()
	@PrimaryGeneratedColumn()
	id: number;

	@ApiProperty()
	@Column()
	name: string;

	@ApiProperty()
	@Column()
	brand: string;

	@ApiProperty()
	@Column({ default: 0 })
	recommendations: number;

	@ApiProperty()
	@JoinTable()
	@ManyToMany(type => Flavor, (flavor) => flavor.coffees,
		{
			cascade: true
		})
	flavors: Flavor[];
}
