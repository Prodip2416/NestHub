import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ErrorLogger implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
      if (res.statusCode >= 400) {
        console.error(`[ERROR]: ${req.method} ${req.url} - ${res.statusCode}`);
      }
    });
    next();
  }
}
