import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
    BadGatewayException,
  } from '@nestjs/common';
  import { Observable, catchError } from 'rxjs';
  
  @Injectable()
  export class ErrorsInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        catchError((err) => {
          console.error(`[INTERCEPTOR ERROR]: ${err.message}`);
          throw new BadGatewayException();
        }),
      );
    }
  }
  