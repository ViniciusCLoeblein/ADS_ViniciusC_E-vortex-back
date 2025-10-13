import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { RmqService } from 'apps/generics/rmq';
import { SalesModule } from './sales.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(SalesModule);
  const configurationService = app.get(ConfigService);
  const optionsRmq = new RmqService(
    'SALES',
    configurationService,
  ).getConnectionRmq();
  app.connectMicroservice<MicroserviceOptions>(optionsRmq);
  app.startAllMicroservices();
  await app.init();
}

bootstrap();
