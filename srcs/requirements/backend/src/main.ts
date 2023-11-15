import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { ValidationPipe } from '@nestjs/common';

function  swagger_set(app){
  const config = new DocumentBuilder()
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  swagger_set(app);
  app.useGlobalPipes(new ValidationPipe({whitelist: true}));
  await app.listen(3000);
}

bootstrap();
