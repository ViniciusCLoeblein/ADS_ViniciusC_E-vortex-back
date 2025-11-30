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
import { VendedoresEntity } from '../entities/vendedores.entity';
import { PedidosEntity } from '../entities/pedidos.entity';
import { ItensPedidoEntity } from '../entities/itens_pedido.entity';
import { AvaliacoesEntity } from '../entities/avaliacoes.entity';
import { UsuariosEntity } from '../entities/usuarios.entity';
import { CuponsEntity } from '../entities/cupons.entity';
import { NotificationsExpoModule } from '../notifications-expo/notifications-expo.module';

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
      VendedoresEntity,
      PedidosEntity,
      ItensPedidoEntity,
      AvaliacoesEntity,
      UsuariosEntity,
      CuponsEntity,
    ]),
    NotificationsExpoModule,
  ],
  controllers: [SalesController],
  providers: [SalesRepository, SalesService, StorageService],
  exports: [SalesService],
})
export class SalesModule {}
