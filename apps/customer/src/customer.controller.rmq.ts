import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CustomerService } from './customer.service';
import { IExceptionFilter } from 'apps/generics/filters/IExceptionFilterGrpc';
import {
  CriarEnderecoPayload,
  ObterEnderecoPayload,
  AtualizarEnderecoPayload,
  ExcluirEnderecoPayload,
} from './types/endereco.types';
import { CriarCartaoPayload, ExcluirCartaoPayload } from './types/cartao.types';
import {
  ListarNotificacoesPayload,
  MarcarComoLidaPayload,
} from './types/notificacao.types';
import { ListarPedidosPayload, ObterPedidoPayload } from './types/pedido.types';

@Controller()
@UseFilters(IExceptionFilter)
export class CustomerControllerRMQ {
  constructor(private readonly customerService: CustomerService) {}

  @MessagePattern({ cmd: 'Customer.CriarEndereco' })
  criarEndereco(payload: CriarEnderecoPayload) {
    return this.customerService.criarEndereco(payload);
  }

  @MessagePattern({ cmd: 'Customer.ListarEnderecos' })
  listarEnderecos(payload: ListarNotificacoesPayload) {
    return this.customerService.listarEnderecos(payload.usuarioId);
  }

  @MessagePattern({ cmd: 'Customer.ObterEndereco' })
  obterEndereco(payload: ObterEnderecoPayload) {
    return this.customerService.obterEndereco(payload.id, payload.usuarioId);
  }

  @MessagePattern({ cmd: 'Customer.AtualizarEndereco' })
  atualizarEndereco(payload: AtualizarEnderecoPayload) {
    return this.customerService.atualizarEndereco(payload);
  }

  @MessagePattern({ cmd: 'Customer.ExcluirEndereco' })
  excluirEndereco(payload: ExcluirEnderecoPayload) {
    return this.customerService.excluirEndereco(payload.id, payload.usuarioId);
  }

  @MessagePattern({ cmd: 'Customer.CriarCartao' })
  criarCartao(payload: CriarCartaoPayload) {
    return this.customerService.criarCartao(payload);
  }

  @MessagePattern({ cmd: 'Customer.ListarCartoes' })
  listarCartoes(payload: ListarNotificacoesPayload) {
    return this.customerService.listarCartoes(payload.usuarioId);
  }

  @MessagePattern({ cmd: 'Customer.ExcluirCartao' })
  excluirCartao(payload: ExcluirCartaoPayload) {
    return this.customerService.excluirCartao(payload.id, payload.usuarioId);
  }

  @MessagePattern({ cmd: 'Customer.ListarNotificacoes' })
  listarNotificacoes(payload: ListarNotificacoesPayload) {
    return this.customerService.listarNotificacoes(payload.usuarioId);
  }

  @MessagePattern({ cmd: 'Customer.MarcarComoLida' })
  marcarComoLida(payload: MarcarComoLidaPayload) {
    return this.customerService.marcarComoLida(payload.id, payload.usuarioId);
  }

  @MessagePattern({ cmd: 'Customer.ListarPedidos' })
  listarPedidos(payload: ListarPedidosPayload) {
    return this.customerService.listarPedidos(payload.usuarioId);
  }

  @MessagePattern({ cmd: 'Customer.ObterPedido' })
  obterPedido(payload: ObterPedidoPayload) {
    return this.customerService.obterPedido(payload.id, payload.usuarioId);
  }
}
