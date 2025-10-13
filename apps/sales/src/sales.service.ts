import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SalesRepository } from './sales.repository';
import { AdicionarItemCarrinhoDto } from './dto/adicionar-item-carrinho.dto';
import { AtualizarItemCarrinhoDto } from './dto/atualizar-item-carrinho.dto';
import { RemoverItemCarrinhoDto } from './dto/remover-item-carrinho.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class SalesService {
  constructor(private readonly salesRepository: SalesRepository) {}

  async obterCarrinho(usuarioId?: string, sessaoId?: string) {
    if (!usuarioId && !sessaoId) {
      throw new BadRequestException(
        'É necessário fornecer usuarioId ou sessaoId',
      );
    }

    let carrinho = usuarioId
      ? await this.salesRepository.findCarrinhoByUsuario(usuarioId)
      : await this.salesRepository.findCarrinhoBySessao(sessaoId);

    if (!carrinho) {
      // Criar novo carrinho
      carrinho = await this.salesRepository.createCarrinho({
        usuario_id: usuarioId || null,
        sessao_id: sessaoId || null,
        ativo: true,
        expira_em: sessaoId
          ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          : null, // 7 dias para sessão
      });
    }

    const itens = await this.salesRepository.findItensCarrinho(carrinho.id);

    // Buscar informações dos produtos
    const itensCompletos = await Promise.all(
      itens.map(async (item) => {
        const produto = await this.salesRepository.findProdutoById(
          item.produto_id,
        );
        const variacao = item.variacao_id
          ? await this.salesRepository.findVariacaoById(item.variacao_id)
          : null;

        return {
          id: item.id,
          produtoId: item.produto_id,
          variacaoId: item.variacao_id,
          quantidade: item.quantidade,
          precoUnitario: item.preco_unitario,
          produto: produto
            ? {
                id: produto.id,
                nome: produto.nome,
                sku: produto.sku,
                preco: produto.preco,
                precoPromocional: produto.precoPromocional,
              }
            : null,
          variacao: variacao
            ? {
                id: variacao.id,
                tipo: variacao.tipo,
                valor: variacao.valor,
                precoAdicional: variacao.preco_adicional,
              }
            : null,
        };
      }),
    );

    return {
      carrinhoId: carrinho.id,
      itens: itensCompletos,
      total: itensCompletos.reduce((acc, item) => {
        const preco = parseFloat(item.precoUnitario);
        return acc + preco * item.quantidade;
      }, 0),
    };
  }

  async adicionarItemCarrinho(payload: AdicionarItemCarrinhoDto) {
    const { usuarioId, sessaoId, produtoId, variacaoId, quantidade } = payload;

    if (!usuarioId && !sessaoId) {
      throw new BadRequestException(
        'É necessário fornecer usuarioId ou sessaoId',
      );
    }

    // Verificar se o produto existe
    const produto = await this.salesRepository.findProdutoById(produtoId);
    if (!produto) {
      throw new NotFoundException('Produto não encontrado');
    }

    // Verificar variação se fornecida
    if (variacaoId) {
      const variacao = await this.salesRepository.findVariacaoById(variacaoId);
      if (!variacao || variacao.produto_id !== produtoId) {
        throw new NotFoundException('Variação não encontrada');
      }
    }

    // Obter ou criar carrinho
    let carrinho = usuarioId
      ? await this.salesRepository.findCarrinhoByUsuario(usuarioId)
      : await this.salesRepository.findCarrinhoBySessao(sessaoId);

    if (!carrinho) {
      carrinho = await this.salesRepository.createCarrinho({
        usuario_id: usuarioId || null,
        sessao_id: sessaoId || null,
        ativo: true,
        expira_em: sessaoId
          ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          : null,
      });
    }

    // Verificar se o item já existe no carrinho
    const itemExistente = await this.salesRepository.findItemCarrinho(
      carrinho.id,
      produtoId,
      variacaoId,
    );

    if (itemExistente) {
      // Atualizar quantidade
      await this.salesRepository.updateItemCarrinho(itemExistente.id, {
        quantidade: itemExistente.quantidade + quantidade,
      });
    } else {
      // Adicionar novo item
      const precoUnitario = produto.precoPromocional || produto.preco;
      await this.salesRepository.createItemCarrinho({
        carrinho_id: carrinho.id,
        produto_id: produtoId,
        variacao_id: variacaoId || null,
        quantidade,
        preco_unitario: precoUnitario,
      });
    }

    // Atualizar timestamp do carrinho
    await this.salesRepository.updateCarrinho(carrinho.id, {
      atualizado_em: new Date(),
    });

    return this.obterCarrinho(usuarioId, sessaoId);
  }

  async atualizarItemCarrinho(payload: AtualizarItemCarrinhoDto) {
    const { usuarioId, sessaoId, itemId, quantidade } = payload;

    if (!usuarioId && !sessaoId) {
      throw new BadRequestException(
        'É necessário fornecer usuarioId ou sessaoId',
      );
    }

    if (quantidade <= 0) {
      throw new BadRequestException('Quantidade deve ser maior que zero');
    }

    // Verificar se o carrinho existe
    const carrinho = usuarioId
      ? await this.salesRepository.findCarrinhoByUsuario(usuarioId)
      : await this.salesRepository.findCarrinhoBySessao(sessaoId);

    if (!carrinho) {
      throw new NotFoundException('Carrinho não encontrado');
    }

    // Atualizar o item
    await this.salesRepository.updateItemCarrinho(itemId, { quantidade });

    // Atualizar timestamp do carrinho
    await this.salesRepository.updateCarrinho(carrinho.id, {
      atualizado_em: new Date(),
    });

    return this.obterCarrinho(usuarioId, sessaoId);
  }

  async removerItemCarrinho(payload: RemoverItemCarrinhoDto) {
    const { usuarioId, sessaoId, itemId } = payload;

    if (!usuarioId && !sessaoId) {
      throw new BadRequestException(
        'É necessário fornecer usuarioId ou sessaoId',
      );
    }

    // Verificar se o carrinho existe
    const carrinho = usuarioId
      ? await this.salesRepository.findCarrinhoByUsuario(usuarioId)
      : await this.salesRepository.findCarrinhoBySessao(sessaoId);

    if (!carrinho) {
      throw new NotFoundException('Carrinho não encontrado');
    }

    // Remover o item
    await this.salesRepository.deleteItemCarrinho(itemId);

    // Atualizar timestamp do carrinho
    await this.salesRepository.updateCarrinho(carrinho.id, {
      atualizado_em: new Date(),
    });

    return this.obterCarrinho(usuarioId, sessaoId);
  }

  async limparCarrinho(usuarioId?: string, sessaoId?: string) {
    if (!usuarioId && !sessaoId) {
      throw new BadRequestException(
        'É necessário fornecer usuarioId ou sessaoId',
      );
    }

    const carrinho = usuarioId
      ? await this.salesRepository.findCarrinhoByUsuario(usuarioId)
      : await this.salesRepository.findCarrinhoBySessao(sessaoId);

    if (!carrinho) {
      throw new NotFoundException('Carrinho não encontrado');
    }

    await this.salesRepository.deleteItensCarrinho(carrinho.id);

    return { message: 'Carrinho limpo com sucesso' };
  }

  async listarProdutos(params: {
    categoriaId?: string;
    busca?: string;
    pagina?: number;
    limite?: number;
  }) {
    const { categoriaId, busca, pagina = 1, limite = 20 } = params;
    const skip = (pagina - 1) * limite;

    const [produtos, total] = await this.salesRepository.findProdutos({
      categoriaId,
      busca,
      skip,
      take: limite,
    });

    return {
      produtos: produtos.map((p) => ({
        id: p.id,
        uuid: p.uuid,
        nome: p.nome,
        descricaoCurta: p.descricaoCurta,
        preco: p.preco,
        precoPromocional: p.precoPromocional,
        avaliacaoMedia: p.avaliacaoMedia,
        totalAvaliacoes: p.totalAvaliacoes,
        estoque: p.estoque,
      })),
      total,
      pagina,
      limite,
      totalPaginas: Math.ceil(total / limite),
    };
  }

  async obterProduto(produtoId: string) {
    const produto = await this.salesRepository.findProdutoById(produtoId);

    if (!produto) {
      throw new NotFoundException('Produto não encontrado');
    }

    const [variacoes, imagens] = await Promise.all([
      this.salesRepository.findVariacoesByProduto(produtoId),
      this.salesRepository.findImagensByProduto(produtoId),
    ]);

    return {
      id: produto.id,
      uuid: produto.uuid,
      nome: produto.nome,
      descricao: produto.descricao,
      descricaoCurta: produto.descricaoCurta,
      preco: produto.preco,
      precoPromocional: produto.precoPromocional,
      estoque: produto.estoque,
      sku: produto.sku,
      avaliacaoMedia: produto.avaliacaoMedia,
      totalAvaliacoes: produto.totalAvaliacoes,
      variacoes: variacoes.map((v) => ({
        id: v.id,
        tipo: v.tipo,
        valor: v.valor,
        sku: v.sku,
        precoAdicional: v.preco_adicional,
        estoque: v.estoque,
      })),
      imagens: imagens.map((i) => ({
        id: i.id,
        url: i.url,
        tipo: i.tipo,
        legenda: i.legenda,
      })),
    };
  }

  async adicionarFavorito(usuarioId: string, produtoId: string) {
    // Verificar se o produto existe
    const produto = await this.salesRepository.findProdutoById(produtoId);
    if (!produto) {
      throw new NotFoundException('Produto não encontrado');
    }

    // Verificar se já existe
    const favoritoExistente = await this.salesRepository.findFavorito(
      usuarioId,
      produtoId,
    );

    if (favoritoExistente) {
      throw new BadRequestException('Produto já está nos favoritos');
    }

    await this.salesRepository.createFavorito({
      usuario_id: usuarioId,
      produto_id: produtoId,
    });

    return { message: 'Produto adicionado aos favoritos' };
  }

  async removerFavorito(usuarioId: string, produtoId: string) {
    const favorito = await this.salesRepository.findFavorito(
      usuarioId,
      produtoId,
    );

    if (!favorito) {
      throw new NotFoundException('Favorito não encontrado');
    }

    await this.salesRepository.deleteFavorito(favorito.id);

    return { message: 'Produto removido dos favoritos' };
  }

  async listarFavoritos(usuarioId: string) {
    const favoritos =
      await this.salesRepository.findFavoritosByUsuario(usuarioId);

    const produtosIds = favoritos.map((f) => f.produto_id);
    const produtos = await Promise.all(
      produtosIds.map((id) => this.salesRepository.findProdutoById(id)),
    );

    return {
      favoritos: favoritos.map((f, index) => {
        const produto = produtos[index];
        return {
          id: f.id,
          produtoId: f.produto_id,
          criadoEm: f.criado_em,
          produto: produto
            ? {
                id: produto.id,
                nome: produto.nome,
                descricaoCurta: produto.descricaoCurta,
                preco: produto.preco,
                precoPromocional: produto.precoPromocional,
                avaliacaoMedia: produto.avaliacaoMedia,
              }
            : null,
        };
      }),
    };
  }
}
