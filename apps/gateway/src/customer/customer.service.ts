import { Inject, Injectable } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import {
  EnderecoRes,
  ListaEnderecosRes,
  CartaoRes,
  ListaCartoesRes,
  NotificacaoRes,
  ListaNotificacoesRes,
  PedidoDetalheRes,
  ListaPedidosRes,
  MessageRes,
} from './types/customer.types';
import { CriarEnderecoDto } from './dto/criar-endereco.dto';
import { AtualizarEnderecoDto } from './dto/atualizar-endereco.dto';
import { CriarCartaoDto } from './dto/criar-cartao.dto';

@Injectable()
export class CustomerService {
  constructor(
    @Inject('CUSTOMER_SERVICE_RMQ')
    private readonly clientRMQ: ClientRMQ,
  ) {}

  // Endereços
  criarEndereco(
    usuarioId: string,
    payload: CriarEnderecoDto,
  ): Observable<EnderecoRes> {
    return this.clientRMQ.send(
      { cmd: 'Customer.CriarEndereco' },
      { ...payload, usuarioId },
    );
  }

  listarEnderecos(usuarioId: string): Observable<ListaEnderecosRes> {
    return this.clientRMQ.send(
      { cmd: 'Customer.ListarEnderecos' },
      { usuarioId },
    );
  }

  obterEndereco(id: string, usuarioId: string): Observable<EnderecoRes> {
    return this.clientRMQ.send(
      { cmd: 'Customer.ObterEndereco' },
      { id, usuarioId },
    );
  }

  atualizarEndereco(
    id: string,
    usuarioId: string,
    payload: AtualizarEnderecoDto,
  ): Observable<EnderecoRes> {
    return this.clientRMQ.send(
      { cmd: 'Customer.AtualizarEndereco' },
      { id, usuarioId, ...payload },
    );
  }

  excluirEndereco(id: string, usuarioId: string): Observable<MessageRes> {
    return this.clientRMQ.send(
      { cmd: 'Customer.ExcluirEndereco' },
      { id, usuarioId },
    );
  }

  // Cartões
  criarCartao(
    usuarioId: string,
    payload: CriarCartaoDto,
  ): Observable<CartaoRes> {
    return this.clientRMQ.send(
      { cmd: 'Customer.CriarCartao' },
      { ...payload, usuarioId },
    );
  }

  listarCartoes(usuarioId: string): Observable<ListaCartoesRes> {
    return this.clientRMQ.send(
      { cmd: 'Customer.ListarCartoes' },
      { usuarioId },
    );
  }

  excluirCartao(id: string, usuarioId: string): Observable<MessageRes> {
    return this.clientRMQ.send(
      { cmd: 'Customer.ExcluirCartao' },
      { id, usuarioId },
    );
  }

  // Notificações
  listarNotificacoes(usuarioId: string): Observable<ListaNotificacoesRes> {
    return this.clientRMQ.send(
      { cmd: 'Customer.ListarNotificacoes' },
      { usuarioId },
    );
  }

  marcarComoLida(id: string, usuarioId: string): Observable<MessageRes> {
    return this.clientRMQ.send(
      { cmd: 'Customer.MarcarComoLida' },
      { id, usuarioId },
    );
  }

  // Pedidos
  listarPedidos(usuarioId: string): Observable<ListaPedidosRes> {
    return this.clientRMQ.send(
      { cmd: 'Customer.ListarPedidos' },
      { usuarioId },
    );
  }

  obterPedido(id: string, usuarioId: string): Observable<PedidoDetalheRes> {
    return this.clientRMQ.send(
      { cmd: 'Customer.ObterPedido' },
      { id, usuarioId },
    );
  }
}

