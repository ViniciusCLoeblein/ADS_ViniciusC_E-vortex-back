import { Inject, Injectable } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class SalesService {
  constructor(
    @Inject('SALES_SERVICE_RMQ')
    private readonly clientRMQ: ClientRMQ,
  ) {}

  obterCarrinho(payload: {
    usuarioId?: string;
    sessaoId?: string;
  }): Observable<any> {
    return this.clientRMQ.send({ cmd: 'Sales.ObterCarrinho' }, payload);
  }

  adicionarItemCarrinho(payload: {
    usuarioId?: string;
    sessaoId?: string;
    produtoId: string;
    variacaoId?: string;
    quantidade: number;
  }): Observable<any> {
    return this.clientRMQ.send({ cmd: 'Sales.AdicionarItemCarrinho' }, payload);
  }

  atualizarItemCarrinho(payload: {
    usuarioId?: string;
    sessaoId?: string;
    itemId: string;
    quantidade: number;
  }): Observable<any> {
    return this.clientRMQ.send({ cmd: 'Sales.AtualizarItemCarrinho' }, payload);
  }

  removerItemCarrinho(payload: {
    usuarioId?: string;
    sessaoId?: string;
    itemId: string;
  }): Observable<any> {
    return this.clientRMQ.send({ cmd: 'Sales.RemoverItemCarrinho' }, payload);
  }

  limparCarrinho(payload: {
    usuarioId?: string;
    sessaoId?: string;
  }): Observable<any> {
    return this.clientRMQ.send({ cmd: 'Sales.LimparCarrinho' }, payload);
  }

  listarProdutos(payload: {
    categoriaId?: string;
    busca?: string;
    pagina?: number;
    limite?: number;
  }): Observable<any> {
    return this.clientRMQ.send({ cmd: 'Sales.ListarProdutos' }, payload);
  }

  obterProduto(produtoId: string): Observable<any> {
    return this.clientRMQ.send({ cmd: 'Sales.ObterProduto' }, { produtoId });
  }

  adicionarFavorito(payload: {
    usuarioId: string;
    produtoId: string;
  }): Observable<any> {
    return this.clientRMQ.send({ cmd: 'Sales.AdicionarFavorito' }, payload);
  }

  removerFavorito(payload: {
    usuarioId: string;
    produtoId: string;
  }): Observable<any> {
    return this.clientRMQ.send({ cmd: 'Sales.RemoverFavorito' }, payload);
  }

  listarFavoritos(usuarioId: string): Observable<any> {
    return this.clientRMQ.send({ cmd: 'Sales.ListarFavoritos' }, { usuarioId });
  }
}
