import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { getStatusTexts } from '@/utils/constants.util';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = HttpStatus.BAD_REQUEST;

    const exceptionResponse = exception.getResponse();
    const validationErrors = (exceptionResponse as any).message;

    response.status(status).json({
      code: status,
      message: getStatusTexts(status),
      data: validationErrors,
      timestamp: Date.now(),
    });
  }
}
