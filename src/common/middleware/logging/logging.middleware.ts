import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.time('Request-Respose time');
    console.log('Hi from Middleware');

    // To see how much time a request-response cycle takes
    // Notice that this time includes taken by the interceptors, filters, guards, method handlers etc for which this middleware is applied 
    res.on('finish', () => console.timeEnd('Request-Respose time'));
    next();
  }
}
