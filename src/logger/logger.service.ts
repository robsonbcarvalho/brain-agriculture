import { Injectable, LoggerService, Scope } from '@nestjs/common';
import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, colorize } = format;

const logFormat = printf(({ level, message, timestamp, context }) => {
  return `${timestamp} [${context}] ${level}: ${message}`;
});

@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger implements LoggerService {
  private readonly logger = createLogger({
    format: combine(
      colorize(),
      timestamp(),
      logFormat,
    ),
    transports: [
      new transports.Console(),
      new transports.File({ filename: 'application.log' }),
    ],
  });

  setContext(context: string) {
    this.logger.defaultMeta = { context };
  }

  log(message: string, context?: string) {
    this.logger.log('info', message, { context });
  }
  error(message: string, trace: string, context?: string) {
    this.logger.error(message, { trace, context });
  }
  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }
  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }
  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }
}