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
          // Check if the response already contains the desired structure
          if (data?.pagination) {
            return {
              statusCode,
              message: data.message || 'Operation successful',
              data: data.data,
              ...data.pagination,
            };
          }
          return {
              statusCode,
              message: data?.message || 'Operation successful',
              data: data?.data || data, // Wrap controller response
          };
        }),
      );
    }
  }
  