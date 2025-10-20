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
import { ProdutoCriadoRes } from './types/criar-produto.types';
import { CriarProdutoDto } from './dto/criar-produto.dto';
import { CategoriaRes, ListaCategoriasRes } from './types/categoria.types';
import { CriarCategoriaDto } from './dto/criar-categoria.dto';
import { AtualizarCategoriaDto } from './dto/atualizar-categoria.dto';
import { VariacaoRes, ListaVariacoesRes } from './types/variacao.types';
import { CriarVariacaoDto } from './dto/criar-variacao.dto';
import { AtualizarVariacaoDto } from './dto/atualizar-variacao.dto';
import { ImagemUploadRes, ListaImagensRes } from './types/imagem.types';
import { CriarImagemDto } from './dto/criar-imagem.dto';
import { MulterFile } from 'apps/generics/types/multer.types';

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

  criarProduto(
    usuarioId: string,
    payload: CriarProdutoDto,
  ): Observable<ProdutoCriadoRes> {
    return this.clientRMQ.send(
      { cmd: 'Sales.CriarProduto' },
      { ...payload, usuarioId },
    );
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

  // Categorias
  criarCategoria(payload: CriarCategoriaDto): Observable<CategoriaRes> {
    return this.clientRMQ.send({ cmd: 'Sales.CriarCategoria' }, payload);
  }

  listarCategorias(): Observable<ListaCategoriasRes> {
    return this.clientRMQ.send({ cmd: 'Sales.ListarCategorias' }, {});
  }

  obterCategoria(id: string): Observable<CategoriaRes> {
    return this.clientRMQ.send({ cmd: 'Sales.ObterCategoria' }, { id });
  }

  atualizarCategoria(
    id: string,
    payload: AtualizarCategoriaDto,
  ): Observable<CategoriaRes> {
    return this.clientRMQ.send(
      { cmd: 'Sales.AtualizarCategoria' },
      { id, ...payload },
    );
  }

  excluirCategoria(id: string): Observable<MessageRes> {
    return this.clientRMQ.send({ cmd: 'Sales.ExcluirCategoria' }, { id });
  }

  // Variações
  criarVariacao(payload: CriarVariacaoDto): Observable<VariacaoRes> {
    return this.clientRMQ.send({ cmd: 'Sales.CriarVariacao' }, payload);
  }

  listarVariacoesProduto(produtoId: string): Observable<ListaVariacoesRes> {
    return this.clientRMQ.send(
      { cmd: 'Sales.ListarVariacoesProduto' },
      { produtoId },
    );
  }

  obterVariacao(id: string): Observable<VariacaoRes> {
    return this.clientRMQ.send({ cmd: 'Sales.ObterVariacao' }, { id });
  }

  atualizarVariacao(
    id: string,
    payload: AtualizarVariacaoDto,
  ): Observable<VariacaoRes> {
    return this.clientRMQ.send(
      { cmd: 'Sales.AtualizarVariacao' },
      { id, ...payload },
    );
  }

  excluirVariacao(id: string): Observable<MessageRes> {
    return this.clientRMQ.send({ cmd: 'Sales.ExcluirVariacao' }, { id });
  }

  uploadImagem(
    file: MulterFile,
    payload: CriarImagemDto,
  ): Observable<ImagemUploadRes> {
    return this.clientRMQ.send(
      { cmd: 'Sales.UploadImagem' },
      {
        ...payload,
        file: {
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          buffer: file.buffer,
        },
      },
    );
  }

  listarImagensProduto(produtoId: string): Observable<ListaImagensRes> {
    return this.clientRMQ.send(
      { cmd: 'Sales.ListarImagensProduto' },
      { produtoId },
    );
  }

  excluirImagem(id: string): Observable<MessageRes> {
    return this.clientRMQ.send({ cmd: 'Sales.ExcluirImagem' }, { id });
  }
}
