import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { SalesModule } from './sales/sales.module';
import { CustomerModule } from './customer/customer.module';
import { APP_GUARD } from '@nestjs/core';
import { HealthCheckController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { RolesGuard } from './generics/guards/roles.guard';
import { JwtAuthGuard } from './generics/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 1,
        limit: 10,
      },
    ]),
    TerminusModule,
    AuthModule,
    SalesModule,
    CustomerModule,
  ],
  controllers: [HealthCheckController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
