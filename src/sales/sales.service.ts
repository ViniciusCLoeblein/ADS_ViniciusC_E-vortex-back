import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { SalesRepository } from './sales.repository';
import { AdicionarItemCarrinhoDto } from './dto/adicionar-item-carrinho.dto';
import { AtualizarItemCarrinhoDto } from './dto/atualizar-item-carrinho.dto';
import { RemoverItemCarrinhoDto } from './dto/remover-item-carrinho.dto';
import { randomUUID } from 'node:crypto';
import { VariacoesProdutoEntity } from '../entities/variacoes_produto.entity';
import { CategoriasEntity } from '../entities/categorias.entity';
import { StorageService } from '../generics/storage/storage.service';
import { MulterFile } from '../generics/types/multer.types';
import { CriarProdutoDto } from './dto/criar-produto.dto';
import { CriarCategoriaDto } from './dto/criar-categoria.dto';
import { AtualizarCategoriaDto } from './dto/atualizar-categoria.dto';
import { CriarVariacaoDto } from './dto/criar-variacao.dto';
import { AtualizarVariacaoDto } from './dto/atualizar-variacao.dto';
import { CriarImagemDto } from './dto/criar-imagem.dto';

@Injectable()
export class SalesService {
  constructor(
    private readonly salesRepository: SalesRepository,
    private readonly storageService: StorageService,
  ) {}

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
      carrinho = await this.salesRepository.createCarrinho({
        usuario_id: usuarioId || null,
        sessao_id: sessaoId || null,
        ativo: true,
        expira_em: sessaoId
          ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          : null,
      });
    }

    const itens = await this.salesRepository.findItensCarrinho(carrinho.id);

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
        const preco = Number.parseFloat(item.precoUnitario);
        const precoAdicional = item.variacao
          ? Number.parseFloat(item.variacao.precoAdicional)
          : 0;
        const precoTotal = preco + precoAdicional;
        return acc + precoTotal * item.quantidade;
      }, 0),
    };
  }

  async adicionarItemCarrinho(
    payload: AdicionarItemCarrinhoDto & {
      usuarioId?: string;
      sessaoId?: string;
    },
  ) {
    const { usuarioId, sessaoId, produtoId, variacaoId, quantidade } = payload;

    if (!usuarioId && !sessaoId) {
      throw new BadRequestException(
        'É necessário fornecer usuarioId ou sessaoId',
      );
    }

    const produto = await this.salesRepository.findProdutoById(produtoId);
    if (!produto) {
      throw new NotFoundException('Produto não encontrado');
    }

    if (variacaoId) {
      const variacao = await this.salesRepository.findVariacaoById(variacaoId);
      if (variacao?.produto_id !== produtoId) {
        throw new NotFoundException('Variação não encontrada');
      }
    }

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

    const itemExistente = await this.salesRepository.findItemCarrinho(
      carrinho.id,
      produtoId,
      variacaoId,
    );

    if (itemExistente) {
      await this.salesRepository.updateItemCarrinho(itemExistente.id, {
        quantidade: itemExistente.quantidade + quantidade,
      });
    } else {
      const precoUnitario = produto.precoPromocional || produto.preco;
      await this.salesRepository.createItemCarrinho({
        carrinho_id: carrinho.id,
        produto_id: produtoId,
        variacao_id: variacaoId || null,
        quantidade,
        preco_unitario: precoUnitario,
      });
    }

    await this.salesRepository.updateCarrinho(carrinho.id, {
      atualizado_em: new Date(),
    });

    return this.obterCarrinho(usuarioId, sessaoId);
  }

  async atualizarItemCarrinho(
    payload: AtualizarItemCarrinhoDto & {
      usuarioId?: string;
      sessaoId?: string;
      itemId?: string;
    },
  ) {
    const { usuarioId, sessaoId, itemId, quantidade } = payload;

    if (!usuarioId && !sessaoId) {
      throw new BadRequestException(
        'É necessário fornecer usuarioId ou sessaoId',
      );
    }

    if (quantidade <= 0) {
      throw new BadRequestException('Quantidade deve ser maior que zero');
    }

    const carrinho = usuarioId
      ? await this.salesRepository.findCarrinhoByUsuario(usuarioId)
      : await this.salesRepository.findCarrinhoBySessao(sessaoId);

    if (!carrinho) {
      throw new NotFoundException('Carrinho não encontrado');
    }

    await this.salesRepository.updateItemCarrinho(itemId, { quantidade });
    await this.salesRepository.updateCarrinho(carrinho.id, {
      atualizado_em: new Date(),
    });

    return this.obterCarrinho(usuarioId, sessaoId);
  }

  async removerItemCarrinho(
    payload: RemoverItemCarrinhoDto & { usuarioId?: string; sessaoId?: string },
  ) {
    const { usuarioId, sessaoId, itemId } = payload;

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

    await this.salesRepository.deleteItemCarrinho(itemId);

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
    usuarioId?: string;
    usuarioTipo?: string;
  }) {
    const {
      categoriaId,
      busca,
      pagina = 1,
      limite = 20,
      usuarioId,
      usuarioTipo,
    } = params;
    const skip = (pagina - 1) * limite;

    const vendedorId = usuarioTipo === 'vendedor' ? usuarioId : undefined;

    const [produtos, total] = await this.salesRepository.findProdutos({
      categoriaId,
      busca,
      vendedorId,
      skip,
      take: limite,
    });

    return {
      produtos,
      total,
      pagina,
      limite,
      totalPaginas: Math.ceil(total / limite),
    };
  }

  async obterProduto(
    produtoId: string,
    usuarioId?: string,
    usuarioTipo?: string,
  ) {
    const produto = await this.salesRepository.findProdutoById(produtoId);

    if (!produto) {
      throw new NotFoundException('Produto não encontrado');
    }

    if (usuarioTipo === 'vendedor' && produto.vendedorId !== usuarioId) {
      throw new NotFoundException('Produto não encontrado');
    }

    return produto;
  }

  async adicionarFavorito(usuarioId: string, produtoId: string) {
    const produto = await this.salesRepository.findProdutoById(produtoId);
    if (!produto) {
      throw new NotFoundException('Produto não encontrado');
    }

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

  async removerTodosFavoritos(usuarioId: string) {
    await this.salesRepository.deleteAllFavoritosByUsuario(usuarioId);

    return { message: 'Todos os favoritos foram removidos' };
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

  async criarProduto(payload: CriarProdutoDto & { usuarioId: string }) {
    const {
      usuarioId,
      categoriaId,
      sku,
      nome,
      descricao,
      descricaoCurta,
      preco,
      precoPromocional,
      pesoKg,
      alturaCm,
      larguraCm,
      profundidadeCm,
      estoque,
      estoqueMinimo,
      tags,
      destaque,
      ativo,
    } = payload;

    const skuExistente = await this.salesRepository.findProdutoBySku(sku);
    if (skuExistente) {
      throw new ConflictException('SKU já cadastrado');
    }

    const produto = await this.salesRepository.createProduto({
      uuid: randomUUID(),
      vendedorId: usuarioId,
      categoriaId,
      sku,
      nome,
      descricao,
      descricaoCurta,
      preco: preco.toString(),
      precoPromocional: precoPromocional
        ? precoPromocional.toString()
        : preco.toString(),
      pesoKg: pesoKg.toString(),
      alturaCm: alturaCm.toString(),
      larguraCm: larguraCm.toString(),
      profundidadeCm: profundidadeCm.toString(),
      estoque,
      estoqueMinimo,
      vendidos: 0,
      visualizacoes: 0,
      avaliacaoMedia: '0.00',
      totalAvaliacoes: 0,
      tags: tags || '',
      ativo: ativo ?? true,
      destaque: destaque ?? false,
    });

    return produto;
  }

  async criarCategoria(payload: CriarCategoriaDto) {
    const { nome, descricao, slug, icone, corHex, ordem, categoriaPaiId } =
      payload;

    const slugExistente = await this.salesRepository.findCategoriaBySlug(slug);
    if (slugExistente) {
      throw new ConflictException('Slug já está em uso');
    }

    const categoria = await this.salesRepository.createCategoria({
      uuid: randomUUID(),
      nome,
      descricao,
      slug,
      icone: icone || '',
      cor_hex: corHex || '#000000',
      ordem: ordem ?? 0,
      categoria_pai_id: categoriaPaiId || null,
      ativo: true,
    });

    return categoria;
  }

  async listarCategorias() {
    const categorias = await this.salesRepository.findAllCategorias();
    return {
      categorias,
      total: categorias.length,
    };
  }

  async obterCategoria(id: string) {
    const categoria = await this.salesRepository.findCategoriaById(id);
    if (!categoria) {
      throw new NotFoundException('Categoria não encontrada');
    }
    return categoria;
  }

  async atualizarCategoria(payload: AtualizarCategoriaDto & { id: string }) {
    const { id, slug, ...data } = payload;

    const categoria = await this.salesRepository.findCategoriaById(id);
    if (!categoria) {
      throw new NotFoundException('Categoria não encontrada');
    }

    if (slug && slug !== categoria.slug) {
      const slugExistente =
        await this.salesRepository.findCategoriaBySlug(slug);
      if (slugExistente) {
        throw new ConflictException('Slug já está em uso');
      }
    }

    const updateData: Partial<CategoriasEntity> = {};
    if (data.nome) updateData.nome = data.nome;
    if (data.descricao) updateData.descricao = data.descricao;
    if (slug) updateData.slug = slug;
    if (data.icone !== undefined) updateData.icone = data.icone;
    if (data.corHex !== undefined) updateData.cor_hex = data.corHex;
    if (data.ordem !== undefined) updateData.ordem = data.ordem;
    if (data.categoriaPaiId !== undefined)
      updateData.categoria_pai_id = data.categoriaPaiId;
    if (data.ativo !== undefined) updateData.ativo = data.ativo;

    await this.salesRepository.updateCategoria(id, updateData);

    return this.salesRepository.findCategoriaById(id);
  }

  async excluirCategoria(id: string) {
    const categoria = await this.salesRepository.findCategoriaById(id);
    if (!categoria) {
      throw new NotFoundException('Categoria não encontrada');
    }

    await this.salesRepository.deleteCategoria(id);

    return { message: 'Categoria excluída com sucesso' };
  }

  async criarVariacao(
    payload: CriarVariacaoDto & { usuarioId?: string; usuarioTipo?: string },
  ) {
    const {
      produtoId,
      tipo,
      valor,
      sku,
      precoAdicional,
      estoque,
      ordem,
      usuarioId,
      usuarioTipo,
    } = payload;

    const produto = await this.salesRepository.findProdutoById(produtoId);
    if (!produto) {
      throw new NotFoundException('Produto não encontrado');
    }

    if (usuarioTipo === 'vendedor' && produto.vendedorId !== usuarioId) {
      throw new NotFoundException('Produto não encontrado');
    }

    const skuExistente = await this.salesRepository.findVariacaoBySku(sku);
    if (skuExistente) {
      throw new ConflictException('SKU da variação já está em uso');
    }

    const variacao = await this.salesRepository.createVariacao({
      produto_id: produtoId,
      tipo,
      valor,
      sku,
      preco_adicional: precoAdicional ? precoAdicional.toString() : '0.00',
      estoque,
      ordem: ordem ?? 0,
    });

    return variacao;
  }

  async listarVariacoesProduto(
    produtoId: string,
    usuarioId?: string,
    usuarioTipo?: string,
  ) {
    if (usuarioTipo === 'vendedor') {
      const produto = await this.salesRepository.findProdutoById(produtoId);
      if (produto?.vendedorId !== usuarioId) {
        throw new NotFoundException('Produto não encontrado');
      }
    }

    const variacoes =
      await this.salesRepository.findAllVariacoesByProduto(produtoId);
    return {
      variacoes,
      total: variacoes.length,
    };
  }

  async obterVariacao(id: string, usuarioId?: string, usuarioTipo?: string) {
    const variacao = await this.salesRepository.findVariacaoById(id);
    if (!variacao) {
      throw new NotFoundException('Variação não encontrada');
    }

    if (usuarioTipo === 'vendedor') {
      const produto = await this.salesRepository.findProdutoById(
        variacao.produto_id,
      );
      if (produto?.vendedorId !== usuarioId) {
        throw new NotFoundException('Variação não encontrada');
      }
    }

    return variacao;
  }

  async atualizarVariacao(
    payload: AtualizarVariacaoDto & {
      id: string;
      usuarioId?: string;
      usuarioTipo?: string;
    },
  ) {
    const { id, sku, usuarioId, usuarioTipo, ...data } = payload;

    const variacao = await this.salesRepository.findVariacaoById(id);
    if (!variacao) {
      throw new NotFoundException('Variação não encontrada');
    }

    if (usuarioTipo === 'vendedor') {
      const produto = await this.salesRepository.findProdutoById(
        variacao.produto_id,
      );
      if (produto?.vendedorId !== usuarioId) {
        throw new NotFoundException('Variação não encontrada');
      }
    }

    if (sku && sku !== variacao.sku) {
      const skuExistente = await this.salesRepository.findVariacaoBySku(sku);
      if (skuExistente) {
        throw new ConflictException('SKU da variação já está em uso');
      }
    }

    const updateData: Partial<VariacoesProdutoEntity> = {};
    if (data.tipo) updateData.tipo = data.tipo;
    if (data.valor) updateData.valor = data.valor;
    if (sku) updateData.sku = sku;
    if (data.precoAdicional !== undefined)
      updateData.preco_adicional = data.precoAdicional.toString();
    if (data.estoque !== undefined) updateData.estoque = data.estoque;
    if (data.ordem !== undefined) updateData.ordem = data.ordem;

    await this.salesRepository.updateVariacao(id, updateData);

    return this.salesRepository.findVariacaoById(id);
  }

  async excluirVariacao(id: string, usuarioId?: string, usuarioTipo?: string) {
    const variacao = await this.salesRepository.findVariacaoById(id);
    if (!variacao) {
      throw new NotFoundException('Variação não encontrada');
    }

    if (usuarioTipo === 'vendedor') {
      const produto = await this.salesRepository.findProdutoById(
        variacao.produto_id,
      );
      if (produto?.vendedorId !== usuarioId) {
        throw new NotFoundException('Variação não encontrada');
      }
    }

    await this.salesRepository.deleteVariacao(id);

    return { message: 'Variação excluída com sucesso' };
  }

  async uploadImagem(
    payload: CriarImagemDto & {
      file: {
        originalname: string;
        mimetype: string;
        size: number;
        buffer: Buffer;
      };
      usuarioId?: string;
      usuarioTipo?: string;
    },
  ) {
    const { produtoId, tipo, legenda, ordem, file, usuarioId, usuarioTipo } =
      payload;

    const produto = await this.salesRepository.findProdutoById(produtoId);
    if (!produto) {
      throw new NotFoundException('Produto não encontrado');
    }

    if (usuarioTipo === 'vendedor' && produto.vendedorId !== usuarioId) {
      throw new NotFoundException('Produto não encontrado');
    }

    const allowedMimetypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
    ];
    if (!allowedMimetypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Formato de arquivo inválido. Permitido: JPEG, PNG, WEBP',
      );
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException(
        'Arquivo muito grande. Tamanho máximo: 5MB',
      );
    }

    const fileData: MulterFile = {
      fieldname: 'file',
      originalname: file.originalname,
      encoding: '7bit',
      mimetype: file.mimetype,
      size: file.size,
      buffer: Buffer.from(file.buffer),
    };

    const url = await this.storageService.saveFile(fileData, produtoId);
    const imagem = await this.salesRepository.createImagem({
      produto_id: produtoId,
      url: 'http://163.176.133.251:3000' + url,
      tipo,
      legenda: legenda || null,
      ordem: ordem ?? 0,
    });

    return {
      id: imagem.id,
      url: imagem.url,
      message: 'Imagem enviada com sucesso',
    };
  }

  async listarImagensProduto(
    produtoId: string,
    usuarioId?: string,
    usuarioTipo?: string,
  ) {
    if (usuarioTipo === 'vendedor') {
      const produto = await this.salesRepository.findProdutoById(produtoId);
      if (produto?.vendedorId !== usuarioId) {
        throw new NotFoundException('Produto não encontrado');
      }
    }

    const imagens =
      await this.salesRepository.findAllImagensByProduto(produtoId);
    return {
      imagens,
      total: imagens.length,
    };
  }

  async excluirImagem(id: string, usuarioId?: string, usuarioTipo?: string) {
    const imagem = await this.salesRepository.findImagemById(id);
    if (!imagem) {
      throw new NotFoundException('Imagem não encontrada');
    }

    if (usuarioTipo === 'vendedor') {
      const produto = await this.salesRepository.findProdutoById(
        imagem.produto_id,
      );
      if (produto?.vendedorId !== usuarioId) {
        throw new NotFoundException('Imagem não encontrada');
      }
    }

    await this.storageService.deleteFile(imagem.url);
    await this.salesRepository.deleteImagem(id);

    return { message: 'Imagem excluída com sucesso' };
  }

  async listarVendedores(params: {
    busca?: string;
    pagina?: number;
    limite?: number;
  }) {
    const { busca, pagina = 1, limite = 20 } = params;
    const skip = (pagina - 1) * limite;

    const [vendedores, total] = await this.salesRepository.findVendedores({
      busca,
      skip,
      take: limite,
    });

    const vendedoresPublicos = vendedores.map((v) => ({
      id: v.id,
      uuid: v.uuid,
      nomeFantasia: v.nome_fantasia,
      razaoSocial: v.razao_social,
      status: v.status,
      dataAprovacao: v.data_aprovacao,
      criadoEm: v.criado_em,
    }));

    return {
      vendedores: vendedoresPublicos,
      total,
      pagina,
      limite,
      totalPaginas: Math.ceil(total / limite),
    };
  }

  async obterVendedor(id: string) {
    const vendedor = await this.salesRepository.findVendedorById(id);

    if (!vendedor) {
      throw new NotFoundException('Vendedor não encontrado');
    }

    return {
      id: vendedor.id,
      uuid: vendedor.uuid,
      nomeFantasia: vendedor.nome_fantasia,
      razaoSocial: vendedor.razao_social,
      status: vendedor.status,
      dataAprovacao: vendedor.data_aprovacao,
      criadoEm: vendedor.criado_em,
    };
  }

  async obterVendedorPorUsuarioId(id: string) {
    const vendedor = await this.salesRepository.findVendedorByUsuarioId(id);

    if (!vendedor) {
      throw new NotFoundException('Vendedor não encontrado');
    }

    return {
      id: vendedor.id,
      uuid: vendedor.uuid,
      nomeFantasia: vendedor.nome_fantasia,
      razaoSocial: vendedor.razao_social,
      status: vendedor.status,
      dataAprovacao: vendedor.data_aprovacao,
      criadoEm: vendedor.criado_em,
    };
  }

  async atualizarStatusPedido(
    pedidoId: string,
    payload: {
      status: string;
      codigoRastreamento?: string;
      transportadora?: string;
      previsaoEntrega?: string;
      motivoCancelamento?: string;
    },
    usuarioId: string,
    usuarioTipo: string,
  ) {
    const {
      status,
      codigoRastreamento,
      transportadora,
      previsaoEntrega,
      motivoCancelamento,
    } = payload;

    const pedido = await this.salesRepository.findPedidoById(pedidoId);
    if (!pedido) {
      throw new NotFoundException('Pedido não encontrado');
    }

    // Verificar se o usuário tem permissão para alterar este pedido
    if (usuarioTipo === 'vendedor') {
      const itens =
        await this.salesRepository.findItensPedidoByPedidoId(pedidoId);
      const produtosIds = itens.map((item) => item.produto_id);
      const produtos =
        await this.salesRepository.findProdutosByIds(produtosIds);

      // Verificar se pelo menos um produto pertence ao vendedor
      const temProdutoDoVendedor = produtos.some(
        (produto) => produto.vendedorId === usuarioId,
      );

      if (!temProdutoDoVendedor) {
        throw new ForbiddenException(
          'Você não tem permissão para alterar este pedido',
        );
      }
    } else if (usuarioTipo !== 'admin') {
      throw new ForbiddenException('Acesso negado');
    }

    // Validações de transição de status
    const statusAtual = pedido.status;
    const statusValidos: Record<string, string[]> = {
      pendente: ['pago', 'cancelado'],
      pago: ['processando', 'cancelado'],
      processando: ['enviado', 'cancelado'],
      enviado: ['entregue'],
      entregue: [],
      cancelado: [],
    };

    if (!statusValidos[statusAtual]?.includes(status)) {
      throw new BadRequestException(
        `Não é possível alterar o status de "${statusAtual}" para "${status}"`,
      );
    }

    // Validações específicas por status
    if (status === 'enviado') {
      if (!codigoRastreamento) {
        throw new BadRequestException(
          'Código de rastreamento é obrigatório quando o status é "enviado"',
        );
      }
      if (!transportadora) {
        throw new BadRequestException(
          'Transportadora é obrigatória quando o status é "enviado"',
        );
      }
    }

    if (status === 'cancelado' && !motivoCancelamento) {
      throw new BadRequestException(
        'Motivo do cancelamento é obrigatório quando o status é "cancelado"',
      );
    }

    // Preparar dados de atualização
    const updateData: Partial<typeof pedido> = {
      status,
    };

    // Atualizar datas conforme o status
    if (status === 'pago') {
      updateData.data_pagamento = new Date();
    } else if (status === 'enviado') {
      updateData.data_envio = new Date();
      updateData.codigo_rastreamento = codigoRastreamento;
      updateData.transportadora = transportadora;
      if (previsaoEntrega) {
        updateData.previsao_entrega = new Date(previsaoEntrega);
      }
    } else if (status === 'entregue') {
      updateData.data_entrega = new Date();
    } else if (status === 'cancelado') {
      updateData.data_cancelamento = new Date();
      updateData.motivo_cancelamento = motivoCancelamento;
    }

    await this.salesRepository.updatePedido(pedidoId, updateData);

    const pedidoAtualizado =
      await this.salesRepository.findPedidoById(pedidoId);

    return {
      id: pedidoAtualizado.id,
      uuid: pedidoAtualizado.uuid,
      status: pedidoAtualizado.status,
      codigoRastreamento: pedidoAtualizado.codigo_rastreamento,
      transportadora: pedidoAtualizado.transportadora,
      previsaoEntrega: pedidoAtualizado.previsao_entrega,
      dataPagamento: pedidoAtualizado.data_pagamento,
      dataEnvio: pedidoAtualizado.data_envio,
      dataEntrega: pedidoAtualizado.data_entrega,
      dataCancelamento: pedidoAtualizado.data_cancelamento,
      motivoCancelamento: pedidoAtualizado.motivo_cancelamento,
      atualizadoEm: pedidoAtualizado.atualizado_em,
    };
  }

  async criarAvaliacao(
    payload: {
      pedidoId: string;
      produtoId: string;
      nota: number;
      titulo?: string;
      comentario?: string;
    },
    usuarioId: string,
  ) {
    const { pedidoId, produtoId, nota, titulo, comentario } = payload;

    const pedido = await this.salesRepository.findPedidoByIdAndUsuario(
      pedidoId,
      usuarioId,
    );
    if (!pedido) {
      throw new NotFoundException('Pedido não encontrado');
    }

    if (pedido.status !== 'entregue' && pedido.status !== 'cancelado') {
      throw new BadRequestException(
        'Apenas pedidos entregues ou cancelados podem ser avaliados',
      );
    }

    const itemPedido =
      await this.salesRepository.findItensPedidoByPedidoAndProduto(
        pedidoId,
        produtoId,
      );
    if (!itemPedido) {
      throw new BadRequestException('Este produto não está neste pedido');
    }

    const avaliacaoExistente =
      await this.salesRepository.findAvaliacaoByPedidoAndProduto(
        pedidoId,
        produtoId,
        usuarioId,
      );
    if (avaliacaoExistente) {
      throw new ConflictException('Você já avaliou este produto neste pedido');
    }

    const avaliacao = await this.salesRepository.createAvaliacao({
      pedido_id: pedidoId,
      produto_id: produtoId,
      usuario_id: usuarioId,
      nota,
      titulo: titulo || null,
      comentario: comentario || null,
      aprovada: null, // Aguardando aprovação
    });

    // Calcular nova média de avaliações do produto
    const avaliacoesAprovadas =
      await this.salesRepository.findAvaliacoesByProduto(produtoId);
    const totalAvaliacoes = avaliacoesAprovadas.length + 1; // +1 porque a nova ainda não está aprovada
    const somaNotas =
      avaliacoesAprovadas.reduce((acc, av) => acc + av.nota, 0) + nota;
    const novaMedia = (somaNotas / totalAvaliacoes).toFixed(2);

    // Atualizar produto com nova média
    await this.salesRepository.updateProdutoAvaliacao(
      produtoId,
      novaMedia,
      totalAvaliacoes,
    );

    return {
      id: avaliacao.id,
      pedidoId: avaliacao.pedido_id,
      produtoId: avaliacao.produto_id,
      usuarioId: avaliacao.usuario_id,
      nota: avaliacao.nota,
      titulo: avaliacao.titulo,
      comentario: avaliacao.comentario,
      aprovada: avaliacao.aprovada,
      criadoEm: avaliacao.criado_em,
    };
  }

  async listarAvaliacoesProduto(produtoId: string) {
    const avaliacoes =
      await this.salesRepository.findAvaliacoesByProduto(produtoId);

    return {
      avaliacoes: avaliacoes.map((av) => ({
        id: av.id,
        produtoId: av.produto_id,
        nota: av.nota,
        titulo: av.titulo,
        comentario: av.comentario,
        respostaVendedor: av.resposta_vendedor,
        dataResposta: av.data_resposta,
        criadoEm: av.criado_em,
      })),
      total: avaliacoes.length,
    };
  }
}
