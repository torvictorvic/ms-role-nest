/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as cipher from '@localrepo/lib_lambda_commons';

@Injectable()
class CipherMiddleware implements NestMiddleware {
  private readonly before;
  private readonly after;

  constructor() {
    const middleware = cipher.cipherMiddleware();
    this.before = middleware.before;
    this.after = middleware.after;
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const event = {
      event: {
        httpMethod: req.method,
        body: req.body,
      },
    };

    if (typeof event.event.body === 'object') {
      event.event.body = JSON.stringify(event.event.body);
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      await this.before(event);
      console.log('desencrypt: ', event);
      req.body = JSON.parse(event.event.body);
    }

    const originalSend = res.send.bind(res);

    res.send = (body?: any) => {
      console.log('body', body);
      if (typeof body === 'string') {
        body = JSON.parse(body);
      }
      const response = { body };

      const requestForAfter = {
        response: {
          body: JSON.stringify(response.body),
        },
      };

      this.after(requestForAfter)
        .then(() => {
          console.log(
            'Encrypted response data:',
            requestForAfter.response.body,
          );
          originalSend(requestForAfter.response.body);
        })
        .catch((err) => {
          console.error('Error during response encryption:', err);
          res.status(500).send({ error: 'Failed to process response' });
        });

      return res;
    };

    next();
  }
}

export default CipherMiddleware;
