import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Response } from 'express';
import { AppLogger } from '../logger/logger.service';

const pgCodeErrors = {
    uniqueViolation: '23505', // Código de erro para violação de unicidade no PostgreSQL
};

@Catch(QueryFailedError)
@Injectable()
export class QueryFailedExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: AppLogger) {}
  
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let message = 'Internal server error';
    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    if ((exception as any).code === pgCodeErrors.uniqueViolation) {
      let table = (exception as any).table || 'entity'; // Obtém o nome da tabela, se disponível
      message = `A ${table} with this name already exists`;
      status = HttpStatus.BAD_REQUEST;
    }

    this.logger.error(`${request.method} ${request.url} - ${message}`, 'QueryFailedExceptionFilter', exception.stack);

    response.status(status).json({
      statusCode: status,
      message: message,
    });
  }
}