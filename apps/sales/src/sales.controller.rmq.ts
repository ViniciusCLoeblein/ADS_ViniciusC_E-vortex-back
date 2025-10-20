import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { SalesService } from './sales.service';
import { AdicionarItemCarrinhoDto } from './dto/adicionar-item-carrinho.dto';
import { AtualizarItemCarrinhoDto } from './dto/atualizar-item-carrinho.dto';
import { RemoverItemCarrinhoDto } from './dto/remover-item-carrinho.dto';
import { IExceptionFilter } from 'apps/generics/filters/IExceptionFilterGrpc';

@Controller()
@UseFilters(IExceptionFilter)
export class SalesControllerRMQ {
  constructor(private readonly salesService: SalesService) {}

  @MessagePattern({ cmd: 'Sales.ObterCarrinho' })
  obterCarrinho(payload: { usuarioId?: string; sessaoId?: string }) {
    return this.salesService.obterCarrinho(payload.usuarioId, payload.sessaoId);
  }

  @MessagePattern({ cmd: 'Sales.AdicionarItemCarrinho' })
  adicionarItemCarrinho(payload: AdicionarItemCarrinhoDto) {
    return this.salesService.adicionarItemCarrinho(payload);
  }

  @MessagePattern({ cmd: 'Sales.AtualizarItemCarrinho' })
  atualizarItemCarrinho(payload: AtualizarItemCarrinhoDto) {
    return this.salesService.atualizarItemCarrinho(payload);
  }

  @MessagePattern({ cmd: 'Sales.RemoverItemCarrinho' })
  removerItemCarrinho(payload: RemoverItemCarrinhoDto) {
    return this.salesService.removerItemCarrinho(payload);
  }

  @MessagePattern({ cmd: 'Sales.LimparCarrinho' })
  limparCarrinho(payload: { usuarioId?: string; sessaoId?: string }) {
    return this.salesService.limparCarrinho(
      payload.usuarioId,
      payload.sessaoId,
    );
  }

  @MessagePattern({ cmd: 'Sales.ListarProdutos' })
  listarProdutos(payload: {
    categoriaId?: string;
    busca?: string;
    pagina?: number;
    limite?: number;
  }) {
    return this.salesService.listarProdutos(payload);
  }

  @MessagePattern({ cmd: 'Sales.ObterProduto' })
  obterProduto(payload: { produtoId: string }) {
    return this.salesService.obterProduto(payload.produtoId);
  }

  @MessagePattern({ cmd: 'Sales.AdicionarFavorito' })
  adicionarFavorito(payload: { usuarioId: string; produtoId: string }) {
    return this.salesService.adicionarFavorito(
      payload.usuarioId,
      payload.produtoId,
    );
  }

  @MessagePattern({ cmd: 'Sales.RemoverFavorito' })
  removerFavorito(payload: { usuarioId: string; produtoId: string }) {
    return this.salesService.removerFavorito(
      payload.usuarioId,
      payload.produtoId,
    );
  }

  @MessagePattern({ cmd: 'Sales.ListarFavoritos' })
  listarFavoritos(payload: { usuarioId: string }) {
    return this.salesService.listarFavoritos(payload.usuarioId);
  }

  @MessagePattern({ cmd: 'Sales.CriarProduto' })
  criarProduto(payload: any) {
    return this.salesService.criarProduto(payload);
  }

  @MessagePattern({ cmd: 'Sales.CriarCategoria' })
  criarCategoria(payload: any) {
    return this.salesService.criarCategoria(payload);
  }

  @MessagePattern({ cmd: 'Sales.ListarCategorias' })
  listarCategorias() {
    return this.salesService.listarCategorias();
  }

  @MessagePattern({ cmd: 'Sales.ObterCategoria' })
  obterCategoria(payload: { id: string }) {
    return this.salesService.obterCategoria(payload.id);
  }

  @MessagePattern({ cmd: 'Sales.AtualizarCategoria' })
  atualizarCategoria(payload: any) {
    return this.salesService.atualizarCategoria(payload);
  }

  @MessagePattern({ cmd: 'Sales.ExcluirCategoria' })
  excluirCategoria(payload: { id: string }) {
    return this.salesService.excluirCategoria(payload.id);
  }

  @MessagePattern({ cmd: 'Sales.CriarVariacao' })
  criarVariacao(payload: any) {
    return this.salesService.criarVariacao(payload);
  }

  @MessagePattern({ cmd: 'Sales.ListarVariacoesProduto' })
  listarVariacoesProduto(payload: { produtoId: string }) {
    return this.salesService.listarVariacoesProduto(payload.produtoId);
  }

  @MessagePattern({ cmd: 'Sales.ObterVariacao' })
  obterVariacao(payload: { id: string }) {
    return this.salesService.obterVariacao(payload.id);
  }

  @MessagePattern({ cmd: 'Sales.AtualizarVariacao' })
  atualizarVariacao(payload: any) {
    return this.salesService.atualizarVariacao(payload);
  }

  @MessagePattern({ cmd: 'Sales.ExcluirVariacao' })
  excluirVariacao(payload: { id: string }) {
    return this.salesService.excluirVariacao(payload.id);
  }

  @MessagePattern({ cmd: 'Sales.UploadImagem' })
  uploadImagem(payload: any) {
    return this.salesService.uploadImagem(payload);
  }

  @MessagePattern({ cmd: 'Sales.ListarImagensProduto' })
  listarImagensProduto(payload: { produtoId: string }) {
    return this.salesService.listarImagensProduto(payload.produtoId);
  }

  @MessagePattern({ cmd: 'Sales.ExcluirImagem' })
  excluirImagem(payload: { id: string }) {
    return this.salesService.excluirImagem(payload.id);
  }
}
