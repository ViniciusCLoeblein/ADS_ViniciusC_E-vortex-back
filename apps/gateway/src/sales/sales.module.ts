import { Module } from '@nestjs/common';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxy, ClientProxyFactory } from '@nestjs/microservices';
import { RmqService } from 'apps/generics/rmq';
import { SalesModule as SalesModuleRmq } from 'apps/sales/src/sales.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), SalesModuleRmq],
  controllers: [SalesController],
  providers: [
    {
      provide: 'SALES_SERVICE_RMQ',
      useFactory: (configService: ConfigService): ClientProxy =>
        ClientProxyFactory.create(
          new RmqService('SALES', configService).getConnectionRmq(),
        ),
      inject: [ConfigService],
    },
    SalesService,
  ],
  exports: [],
})
export class SalesModule {}
