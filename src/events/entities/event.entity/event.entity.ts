/* eslint-disable prettier/prettier */
import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

// @Index(['name', 'type'])  can create composite index like this, this annotation would have to be on entity level
@Entity()
export class Event {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	type: string;

	@Index()				// Can create an index on any column if you think this table will be searched often using this index
	@Column()
	name: string;

	@Column('json')
	payload: Record<string, any>;
}
