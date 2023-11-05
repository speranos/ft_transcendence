import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthModule } from './auth/auth.module';
import { PrismaClient } from '@prisma/client';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';


function  swagger_set(app){
  const config = new DocumentBuilder()
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  swagger_set(app);
  await app.listen(3000);
}


bootstrap();
