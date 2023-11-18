/* eslint-disable prettier/prettier */
import { Context } from 'aws-lambda';
import { createServer, proxy } from 'aws-serverless-express';
import express from 'express';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';

const expressApp = express();

export const handler = async (event: any, context: Context) => {
  const server = createServer(expressApp);

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  await app.init();

  return proxy(server, event, context, 'PROMISE');
};
