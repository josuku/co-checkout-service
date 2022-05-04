import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { bill_ms_host, bill_ms_port, logistic_ms_host, logistic_ms_port, port } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.enableCors();
  Logger.log('Running in port ' + port.toString(), 'bootstrap');
  Logger.log('Connected Nest Microservice: ' + bill_ms_host + ':' + bill_ms_port.toString());
  Logger.log('Connected Nest Microservice: ' + logistic_ms_host + ':' + logistic_ms_port.toString());
  await app.listen(port);
}
bootstrap();
