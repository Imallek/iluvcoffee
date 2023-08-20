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

	@Column({ default: 0 })
	recommendations: number;

	@JoinTable()
	@ManyToMany(type => Flavor, (flavor) => flavor.coffees,
		{
			cascade: true
		})
	flavors: Flavor[];
}
