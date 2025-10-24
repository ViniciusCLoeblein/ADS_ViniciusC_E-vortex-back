import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresDatabaseService } from '../generics/database';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { SalesRepository } from './sales.repository';
import { StorageService } from '../generics/storage/storage.service';
import { CarrinhosEntity } from '../entities/carrinhos.entity';
import { ItensCarrinhoEntity } from '../entities/itens_carrinho.entity';
import { ProdutosEntity } from '../entities/produtos.entity';
import { VariacoesProdutoEntity } from '../entities/variacoes_produto.entity';
import { ImagensProdutoEntity } from '../entities/imagens_produto.entity';
import { FavoritosEntity } from '../entities/favoritos.entity';
import { CategoriasEntity } from '../entities/categorias.entity';

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
  controllers: [SalesController],
  providers: [SalesRepository, SalesService, StorageService],
  exports: [SalesService],
})
export class SalesModule {}
