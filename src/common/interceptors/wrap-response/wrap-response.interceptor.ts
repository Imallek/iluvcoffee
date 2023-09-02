/* eslint-disable prettier/prettier */
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class WrapResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before ......');
    return next.handle()
      .pipe(tap(data => console.log('After....', data)))
      .pipe(map((data) => ({ data })))
      .pipe(tap((data) => console.log('Sending....', data)));
  }
}
