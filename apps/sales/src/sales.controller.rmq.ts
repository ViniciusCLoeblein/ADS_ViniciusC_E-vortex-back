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
}
