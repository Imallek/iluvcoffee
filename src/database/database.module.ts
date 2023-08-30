/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { createConnection } from 'typeorm';

@Module({
	/**
	 Since our DatabaseModule hardcodes connection options, we cannot share this module among different applications
	 This is because our database module is statically configured and cannot be customized
	 
	 What if another application wants to use this module but wants to use different port?
	 Using Nest module dynamic features, we can let importing module use an API to configure the options when this module is imported
	 */
	providers: [{
		provide: 'CONNECTION',
		useValue: createConnection({
			type: 'postgres',
			host: 'localhost',
			port: 5432
		})
	}]
})
export class DatabaseModule { }
