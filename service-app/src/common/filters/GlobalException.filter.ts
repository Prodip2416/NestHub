import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Determine HTTP status
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Extract error message
    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal Server Error';

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: this.getErrorMessage(message),
    };

    console.error(`[ERROR]`, {
      status,
      message: errorResponse.message,
      stack: exception.stack,
    });

    response.status(status).json(errorResponse);
  }

  private getErrorMessage(message: any): string {
    if (typeof message === 'string') {
      return message;
    }
    if (typeof message === 'object' && message.message) {
      return Array.isArray(message.message) ? message.message.join(', ') : message.message;
    }
    return 'Unexpected error occurred';
  }
}
