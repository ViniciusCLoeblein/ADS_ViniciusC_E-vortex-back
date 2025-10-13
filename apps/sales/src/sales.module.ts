import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresDatabaseService } from 'apps/generics/database';
import { SalesControllerRMQ } from './sales.controller.rmq';
import { SalesService } from './sales.service';
import { SalesRepository } from './sales.repository';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'apps/generics/guards/jwt-auth.guard';
import { CarrinhosEntity } from 'apps/entities/carrinhos.entity';
import { ItensCarrinhoEntity } from 'apps/entities/itens_carrinho.entity';
import { ProdutosEntity } from 'apps/entities/produtos.entity';
import { VariacoesProdutoEntity } from 'apps/entities/variacoes_produto.entity';
import { ImagensProdutoEntity } from 'apps/entities/imagens_produto.entity';
import { FavoritosEntity } from 'apps/entities/favoritos.entity';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        return new PostgresDatabaseService(
          'SALES',
          config,
        ).getConnectionPostgres();
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      CarrinhosEntity,
      ItensCarrinhoEntity,
      ProdutosEntity,
      VariacoesProdutoEntity,
      ImagensProdutoEntity,
      FavoritosEntity,
    ]),
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
  controllers: [SalesControllerRMQ],
  providers: [
    SalesRepository,
    SalesService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [SalesService],
})
export class SalesModule {}
