import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { ValidationPipe } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ChatGateway } from './chat/chat.gateway';

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
  // app.get('/google/redir', PassportModule.)
  await app.listen(3000);
}

bootstrap();
