/* eslint-disable prettier/prettier */

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Coffee { // sql table generated for this would be lower-case classname e.g coffee, can use @Entity('somedifferentname') for some different name
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	brand: string;

	@Column('json', { nullable: true })
	flavors: string[];
}
