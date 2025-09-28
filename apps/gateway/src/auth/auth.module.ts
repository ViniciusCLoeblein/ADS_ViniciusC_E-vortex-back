import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxy, ClientProxyFactory } from '@nestjs/microservices';
import { RmqService } from 'apps/generics/rmq';
import { AuthModule as AuthModuleRmq } from 'apps/auth/src/auth.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModuleRmq],
  controllers: [AuthController],
  providers: [
    {
      provide: 'AUTH_SERVICE_RMQ',
      useFactory: (configService: ConfigService): ClientProxy =>
        ClientProxyFactory.create(
          new RmqService('AUTH', configService).getConnectionRmq(),
        ),
      inject: [ConfigService],
    },
    AuthService,
  ],
  exports: [],
})
export class AuthModule {}
