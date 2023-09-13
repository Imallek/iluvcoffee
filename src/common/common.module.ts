/* eslint-disable prettier/prettier */
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ApiKeyGuard } from './guards/api-key/api-key.guard';
import { LoggingMiddleware } from './middleware/logging/logging.middleware';

@Module({
	imports: [ConfigModule],
	providers: [{
		provide: APP_GUARD,
		useClass: ApiKeyGuard,
	}]
})
export class CommonModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggingMiddleware).forRoutes('*');

		// to apply middleware to only the routes with coffees prefix
		// consumer.apply(LoggingMiddleware).forRoutes('coffees');

		// to apply middleware to only the routes with coffees prefix and GET methods
		// consumer.apply(LoggingMiddleware).forRoutes({path: 'coffees', method: RequestMethod.GET});

		// to exclude certain routes from middleware
		// consumer.apply(LoggingMiddleware).exclude('coffees').forRoutes('*');


	}

}
