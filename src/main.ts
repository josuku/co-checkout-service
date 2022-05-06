import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { bill_ms_host, bill_ms_port, host, logistic_ms_host, logistic_ms_port, port } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.enableCors();
  Logger.log('Running API in ' + host + ':' + port.toString(), 'bootstrap');
  Logger.log('Using Nest Microservice in ' + bill_ms_host + ':' + bill_ms_port.toString(), 'bootstrap');
  Logger.log('Using Nest Microservice in ' + logistic_ms_host + ':' + logistic_ms_port.toString(), 'bootstrap');
  await app.listen(port);
}
bootstrap();
