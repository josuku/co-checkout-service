import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ? process.env.PORT : 3000;
  app.setGlobalPrefix('api/v1');
  app.enableCors();
  Logger.log('Running in port ' + port.toString());
  await app.listen(port);
}
bootstrap();
