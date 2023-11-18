/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { proxy } from 'aws-serverless-express';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function start() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule, new ExpressAdapter(express));

  const config = new DocumentBuilder()
    .setTitle('Event and Show server')
    .setDescription('REAST API Documentation')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        description: 'JWT Authorization',
        type: 'http',
        in: 'header',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'BearerAuthMethod',
    )
    .addServer(`http://localhost:${PORT}`)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(PORT, () =>
    console.log(`Server started on port = http://localhost:${PORT}`),
  );
  return app.getHttpAdapter().getInstance();
}

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
) => {
  const server = await start();

  return proxy(server, event, context, 'PROMISE').promise;
};

start();
