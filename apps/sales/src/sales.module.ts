import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresDatabaseService } from 'apps/generics/database';
import { SalesControllerRMQ } from './sales.controller.rmq';
import { SalesService } from './sales.service';
import { SalesRepository } from './sales.repository';
import { StorageService } from 'apps/generics/storage/storage.service';
import { CarrinhosEntity } from 'apps/entities/carrinhos.entity';
import { ItensCarrinhoEntity } from 'apps/entities/itens_carrinho.entity';
import { ProdutosEntity } from 'apps/entities/produtos.entity';
import { VariacoesProdutoEntity } from 'apps/entities/variacoes_produto.entity';
import { ImagensProdutoEntity } from 'apps/entities/imagens_produto.entity';
import { FavoritosEntity } from 'apps/entities/favoritos.entity';
import { CategoriasEntity } from 'apps/entities/categorias.entity';

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
      CategoriasEntity,
    ]),
  ],
  controllers: [SalesControllerRMQ],
  providers: [SalesRepository, SalesService, StorageService],
  exports: [SalesService],
})
export class SalesModule {}
