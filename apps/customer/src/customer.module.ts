import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresDatabaseService } from 'apps/generics/database';
import { CustomerControllerRMQ } from './customer.controller.rmq';
import { CustomerService } from './customer.service';
import { CustomerRepository } from './customer.repository';
import { EnderecosEntity } from 'apps/entities/enderecos.entity';
import { CartoesCreditoEntity } from 'apps/entities/cartoes_credito.entity';
import { NotificacoesEntity } from 'apps/entities/notificacoes.entity';
import { PedidosEntity } from 'apps/entities/pedidos.entity';
import { ItensPedidoEntity } from 'apps/entities/itens_pedido.entity';
import { UsuariosEntity } from 'apps/entities/usuarios.entity';

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
    ]),
  ],
  controllers: [CustomerControllerRMQ],
  providers: [CustomerRepository, CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
