import { NestFactory } from '@nestjs/core';
import serverlessExpress from '@codegenie/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';
import { AppModule } from './app.module';
import { LambdaEventService } from './commons/lambda-event.service';
import { ValidationPipe } from '@nestjs/common';

let server: Handler;

async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  if (event.isWarmup) {
    console.log('Warmup event received, skipping normal execution');
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Warmup successful' }),
    };
  }

  server = server ?? (await bootstrap());
  LambdaEventService.setEvent(event);
  return server(event, context, callback);
};
