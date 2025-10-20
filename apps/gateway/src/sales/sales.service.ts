import { Inject, Injectable } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { UsuariosEntity } from 'apps/entities/usuarios.entity';
import { Observable } from 'rxjs';
import {
  CarrinhoRes,
  FavoritosRes,
  MessageRes,
  ProdutoDetalheRes,
  ProdutoListagemRes,
} from './types/sales.types';

@Injectable()
export class SalesService {
  constructor(
    @Inject('SALES_SERVICE_RMQ')
    private readonly clientRMQ: ClientRMQ,
  ) {}

  obterCarrinho(user: UsuariosEntity): Observable<CarrinhoRes> {
    return this.clientRMQ.send(
      { cmd: 'Sales.ObterCarrinho' },
      { usuarioId: user.id },
    );
  }

  adicionarItemCarrinho(
    usuarioId: string,
    payload: {
      produtoId: string;
      variacaoId?: string;
      quantidade: number;
    },
  ): Observable<CarrinhoRes> {
    return this.clientRMQ.send(
      { cmd: 'Sales.AdicionarItemCarrinho' },
      { ...payload, usuarioId },
    );
  }

  atualizarItemCarrinho(
    usuarioId: string,
    itemId: string,
    quantidade: number,
  ): Observable<CarrinhoRes> {
    return this.clientRMQ.send(
      { cmd: 'Sales.AtualizarItemCarrinho' },
      { usuarioId, itemId, quantidade },
    );
  }

  removerItemCarrinho(
    usuarioId: string,
    itemId: string,
  ): Observable<CarrinhoRes> {
    return this.clientRMQ.send(
      { cmd: 'Sales.RemoverItemCarrinho' },
      { usuarioId, itemId },
    );
  }

  limparCarrinho(usuarioId: string): Observable<MessageRes> {
    return this.clientRMQ.send({ cmd: 'Sales.LimparCarrinho' }, { usuarioId });
  }

  listarProdutos(payload: {
    categoriaId?: string;
    busca?: string;
    pagina?: number;
    limite?: number;
  }): Observable<ProdutoListagemRes> {
    return this.clientRMQ.send({ cmd: 'Sales.ListarProdutos' }, payload);
  }

  obterProduto(produtoId: string): Observable<ProdutoDetalheRes> {
    return this.clientRMQ.send({ cmd: 'Sales.ObterProduto' }, { produtoId });
  }

  adicionarFavorito(
    usuarioId: string,
    produtoId: string,
  ): Observable<MessageRes> {
    return this.clientRMQ.send(
      { cmd: 'Sales.AdicionarFavorito' },
      { usuarioId, produtoId },
    );
  }

  removerFavorito(
    usuarioId: string,
    produtoId: string,
  ): Observable<MessageRes> {
    return this.clientRMQ.send(
      { cmd: 'Sales.RemoverFavorito' },
      { usuarioId, produtoId },
    );
  }

  listarFavoritos(usuarioId: string): Observable<FavoritosRes> {
    return this.clientRMQ.send({ cmd: 'Sales.ListarFavoritos' }, { usuarioId });
  }
}
