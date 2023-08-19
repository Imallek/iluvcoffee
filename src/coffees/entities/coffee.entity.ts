/* eslint-disable prettier/prettier */

import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Flavor } from "./flavor.entity";

@Entity()
export class Coffee { // sql table generated for this would be lower-case classname e.g coffee, can use @Entity('somedifferentname') for some different name
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	brand: string;


	@JoinTable()
	@ManyToMany(type => Flavor, (flavor) => flavor.coffees)
	flavors: string[];
}
