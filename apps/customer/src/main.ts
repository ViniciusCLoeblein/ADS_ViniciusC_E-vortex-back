import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { RmqService } from 'apps/generics/rmq';
import { CustomerModule } from './customer.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(CustomerModule);
  const configurationService = app.get(ConfigService);
  const optionsRmq = new RmqService(
    'CUSTOMER',
    configurationService,
  ).getConnectionRmq();
  app.connectMicroservice<MicroserviceOptions>(optionsRmq);
  app.startAllMicroservices();
  await app.init();
}

bootstrap();
