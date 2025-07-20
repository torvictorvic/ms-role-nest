import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response as ExpressResponse } from 'express';
import { HTTP_NOT_FOUND } from '@/utils/constants.util';

@Catch(NotFoundException)
export class NotFoundFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<ExpressResponse>();

    response.status(HTTP_NOT_FOUND).json({
      code: HTTP_NOT_FOUND,
      message: 'La ruta solicitada no fue encontrada.',
      data: request.url,
      timestamp: Date.now(),
    });
  }
}
