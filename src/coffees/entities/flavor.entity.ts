/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Coffee } from './coffee.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Flavor {
	@ApiProperty()
	@PrimaryGeneratedColumn()
	id: number;

	@ApiProperty()
	@Column()
	name: string;

	@ApiProperty()
	@ManyToMany(type => Coffee, (coffee) => coffee.flavors)
	coffees: Coffee[]
}
