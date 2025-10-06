import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresDatabaseService } from 'apps/generics/database';
import { AuthControllerRMQ } from './auth.controller.rmq';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'apps/generics/guards/jwt-auth.guard';
import { UsuariosEntity } from 'apps/entities/usuarios.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        return new PostgresDatabaseService(
          'AUTH',
          config,
        ).getConnectionPostgres();
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([UsuariosEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async () => {
        const options: JwtModuleOptions = {
          secret: process.env.JWT_PRIVATE_KEY,
          signOptions: {
            expiresIn: process.env.JWT_EXPIRES_IN,
            algorithm: 'HS256',
          },
        };

        return options;
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthControllerRMQ],
  providers: [
    AuthRepository,
    AuthService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
