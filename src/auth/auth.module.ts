import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresDatabaseService } from '../generics/database';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { UsuariosEntity } from '../entities/usuarios.entity';
import { VendedoresEntity } from '../entities/vendedores.entity';

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
    TypeOrmModule.forFeature([UsuariosEntity, VendedoresEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      global: true,
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
  controllers: [AuthController],
  providers: [AuthRepository, AuthService],
  exports: [AuthService, AuthRepository],
})
export class AuthModule {}
