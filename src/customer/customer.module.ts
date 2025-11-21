import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresDatabaseService } from '../generics/database';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { CustomerRepository } from './customer.repository';
import { EnderecosEntity } from '../entities/enderecos.entity';
import { CartoesCreditoEntity } from '../entities/cartoes_credito.entity';
import { NotificacoesEntity } from '../entities/notificacoes.entity';
import { PedidosEntity } from '../entities/pedidos.entity';
import { ItensPedidoEntity } from '../entities/itens_pedido.entity';
import { UsuariosEntity } from '../entities/usuarios.entity';
import { ProdutosEntity } from '../entities/produtos.entity';
import { VariacoesProdutoEntity } from '../entities/variacoes_produto.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        return new PostgresDatabaseService(
          'CUSTOMER',
          config,
        ).getConnectionPostgres();
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      EnderecosEntity,
      CartoesCreditoEntity,
      NotificacoesEntity,
      PedidosEntity,
      ItensPedidoEntity,
      UsuariosEntity,
      ProdutosEntity,
      VariacoesProdutoEntity,
    ]),
  ],
  controllers: [CustomerController],
  providers: [CustomerRepository, CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
