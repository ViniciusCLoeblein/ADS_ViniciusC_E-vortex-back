import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxy, ClientProxyFactory } from '@nestjs/microservices';
import { RmqService } from 'apps/generics/rmq';
import { CustomerModule as CustomerModuleRmq } from 'apps/customer/src/customer.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), CustomerModuleRmq],
  controllers: [CustomerController],
  providers: [
    {
      provide: 'CUSTOMER_SERVICE_RMQ',
      useFactory: (configService: ConfigService): ClientProxy =>
        ClientProxyFactory.create(
          new RmqService('CUSTOMER', configService).getConnectionRmq(),
        ),
      inject: [ConfigService],
    },
    CustomerService,
  ],
  exports: [],
})
export class CustomerModule {}

