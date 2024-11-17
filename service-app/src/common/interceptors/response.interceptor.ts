import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
  
  @Injectable()
  export class ResponseInterceptor<T> implements NestInterceptor<T> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        map((data) => {
          const statusCode = context.switchToHttp().getResponse().statusCode;
  
          return {
              statusCode,
              message: data?.message || 'Data added successfully',
              data: data?.data || data, // Wrap controller response
          };
        }),
      );
    }
  }
  