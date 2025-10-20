import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { SalesRepository } from './sales.repository';
import { AdicionarItemCarrinhoDto } from './dto/adicionar-item-carrinho.dto';
import { AtualizarItemCarrinhoDto } from './dto/atualizar-item-carrinho.dto';
import { RemoverItemCarrinhoDto } from './dto/remover-item-carrinho.dto';
import { randomUUID } from 'crypto';
import { VariacoesProdutoEntity } from 'apps/entities/variacoes_produto.entity';
import { CategoriasEntity } from 'apps/entities/categorias.entity';
import { StorageService } from 'apps/generics/storage/storage.service';
import { MulterFile } from 'apps/generics/types/multer.types';
import { CriarProdutoRmqDto } from './dto/criar-produto-rmq.dto';
import { CriarCategoriaRmqDto } from './dto/criar-categoria-rmq.dto';
import { AtualizarCategoriaRmqDto } from './dto/atualizar-categoria-rmq.dto';
import { CriarVariacaoRmqDto } from './dto/criar-variacao-rmq.dto';
import { AtualizarVariacaoRmqDto } from './dto/atualizar-variacao-rmq.dto';
import { UploadImagemRmqDto } from './dto/upload-imagem-rmq.dto';

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
        const preco = parseFloat(item.precoUnitario);
        const precoAdicional = item.variacao
          ? parseFloat(item.variacao.precoAdicional)
          : 0;
        const precoTotal = preco + precoAdicional;
        return acc + precoTotal * item.quantidade;
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

    const produto = await this.salesRepository.findProdutoById(produtoId);
    if (!produto) {
      throw new NotFoundException('Produto não encontrado');
    }

    if (variacaoId) {
      const variacao = await this.salesRepository.findVariacaoById(variacaoId);
      if (!variacao || variacao.produto_id !== produtoId) {
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

  async removerItemCarrinho(payload: RemoverItemCarrinhoDto) {
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

  async criarProduto(payload: CriarProdutoRmqDto) {
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
      ativo: ativo !== undefined ? ativo : true,
      destaque: destaque !== undefined ? destaque : false,
    });

    return produto;
  }

  async criarCategoria(payload: CriarCategoriaRmqDto) {
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
      ordem: ordem !== undefined ? ordem : 0,
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

  async atualizarCategoria(payload: AtualizarCategoriaRmqDto) {
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

  // Variações
  async criarVariacao(payload: CriarVariacaoRmqDto) {
    const { produtoId, tipo, valor, sku, precoAdicional, estoque, ordem } =
      payload;

    // Verificar se o produto existe
    const produto = await this.salesRepository.findProdutoById(produtoId);
    if (!produto) {
      throw new NotFoundException('Produto não encontrado');
    }

    // Verificar se o SKU já existe
    const skuExistente = await this.salesRepository.findVariacaoBySku(sku);
    if (skuExistente) {
      throw new ConflictException('SKU da variação já está em uso');
    }

    // Criar a variação
    const variacao = await this.salesRepository.createVariacao({
      produto_id: produtoId,
      tipo,
      valor,
      sku,
      preco_adicional: precoAdicional ? precoAdicional.toString() : '0.00',
      estoque,
      ordem: ordem !== undefined ? ordem : 0,
    });

    return variacao;
  }

  async listarVariacoesProduto(produtoId: string) {
    const variacoes =
      await this.salesRepository.findAllVariacoesByProduto(produtoId);
    return {
      variacoes,
      total: variacoes.length,
    };
  }

  async obterVariacao(id: string) {
    const variacao = await this.salesRepository.findVariacaoById(id);
    if (!variacao) {
      throw new NotFoundException('Variação não encontrada');
    }
    return variacao;
  }

  async atualizarVariacao(payload: AtualizarVariacaoRmqDto) {
    const { id, sku, ...data } = payload;

    // Verificar se a variação existe
    const variacao = await this.salesRepository.findVariacaoById(id);
    if (!variacao) {
      throw new NotFoundException('Variação não encontrada');
    }

    // Se está alterando o SKU, verificar se já existe
    if (sku && sku !== variacao.sku) {
      const skuExistente = await this.salesRepository.findVariacaoBySku(sku);
      if (skuExistente) {
        throw new ConflictException('SKU da variação já está em uso');
      }
    }

    // Atualizar
    const updateData: Partial<VariacoesProdutoEntity> = {};
    if (data.tipo) updateData.tipo = data.tipo;
    if (data.valor) updateData.valor = data.valor;
    if (sku) updateData.sku = sku;
    if (data.precoAdicional !== undefined)
      updateData.preco_adicional = data.precoAdicional.toString();
    if (data.estoque !== undefined) updateData.estoque = data.estoque;
    if (data.ordem !== undefined) updateData.ordem = data.ordem;

    await this.salesRepository.updateVariacao(id, updateData);

    // Retornar variação atualizada
    return this.salesRepository.findVariacaoById(id);
  }

  async excluirVariacao(id: string) {
    // Verificar se a variação existe
    const variacao = await this.salesRepository.findVariacaoById(id);
    if (!variacao) {
      throw new NotFoundException('Variação não encontrada');
    }

    await this.salesRepository.deleteVariacao(id);

    return { message: 'Variação excluída com sucesso' };
  }

  async uploadImagem(payload: UploadImagemRmqDto) {
    const { produtoId, tipo, legenda, ordem, file } = payload;

    const produto = await this.salesRepository.findProdutoById(produtoId);
    if (!produto) {
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
      url,
      tipo,
      legenda: legenda || null,
      ordem: ordem !== undefined ? ordem : 0,
    });

    return {
      id: imagem.id,
      url: imagem.url,
      message: 'Imagem enviada com sucesso',
    };
  }

  async listarImagensProduto(produtoId: string) {
    const imagens =
      await this.salesRepository.findAllImagensByProduto(produtoId);
    return {
      imagens,
      total: imagens.length,
    };
  }

  async excluirImagem(id: string) {
    // Verificar se a imagem existe
    const imagem = await this.salesRepository.findImagemById(id);
    if (!imagem) {
      throw new NotFoundException('Imagem não encontrada');
    }

    // Deletar arquivo físico
    await this.storageService.deleteFile(imagem.url);

    // Deletar do banco
    await this.salesRepository.deleteImagem(id);

    return { message: 'Imagem excluída com sucesso' };
  }
}
