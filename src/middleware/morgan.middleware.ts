import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as morgan from 'morgan';
import { AppLogger } from '../logger/logger.service';

@Injectable()
export class MorganMiddleware implements NestMiddleware {
  constructor(private readonly logger: AppLogger) {}

  use(req: Request, res: Response, next: NextFunction) {
    morgan('common', {
      stream: {
        write: (message: string) => this.logger.log(message.trim()),
      },
    })(req, res, next);
  }
}