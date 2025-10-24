import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CarrinhosEntity } from '../entities/carrinhos.entity';
import { ItensCarrinhoEntity } from '../entities/itens_carrinho.entity';
import { ProdutosEntity } from '../entities/produtos.entity';
import { VariacoesProdutoEntity } from '../entities/variacoes_produto.entity';
import { ImagensProdutoEntity } from '../entities/imagens_produto.entity';
import { FavoritosEntity } from '../entities/favoritos.entity';
import { CategoriasEntity } from '../entities/categorias.entity';
import { Repository, Like, FindOptionsWhere } from 'typeorm';

@Injectable()
export class SalesRepository {
  constructor(
    @InjectRepository(CarrinhosEntity)
    private carrinhosRepository: Repository<CarrinhosEntity>,
    @InjectRepository(ItensCarrinhoEntity)
    private itensCarrinhoRepository: Repository<ItensCarrinhoEntity>,
    @InjectRepository(ProdutosEntity)
    private produtosRepository: Repository<ProdutosEntity>,
    @InjectRepository(VariacoesProdutoEntity)
    private variacoesRepository: Repository<VariacoesProdutoEntity>,
    @InjectRepository(ImagensProdutoEntity)
    private imagensRepository: Repository<ImagensProdutoEntity>,
    @InjectRepository(FavoritosEntity)
    private favoritosRepository: Repository<FavoritosEntity>,
    @InjectRepository(CategoriasEntity)
    private categoriasRepository: Repository<CategoriasEntity>,
  ) {}

  async findCarrinhoByUsuario(
    usuarioId: string,
  ): Promise<CarrinhosEntity | null> {
    return this.carrinhosRepository.findOne({
      where: { usuario_id: usuarioId, ativo: true },
    });
  }

  async findCarrinhoBySessao(
    sessaoId: string,
  ): Promise<CarrinhosEntity | null> {
    return this.carrinhosRepository.findOne({
      where: { sessao_id: sessaoId, ativo: true },
    });
  }

  async createCarrinho(
    carrinho: Partial<CarrinhosEntity>,
  ): Promise<CarrinhosEntity> {
    return this.carrinhosRepository.save(carrinho);
  }

  async updateCarrinho(
    id: string,
    data: Partial<CarrinhosEntity>,
  ): Promise<void> {
    await this.carrinhosRepository.update(id, data);
  }

  async findItensCarrinho(carrinhoId: string): Promise<ItensCarrinhoEntity[]> {
    return this.itensCarrinhoRepository.find({
      where: { carrinho_id: carrinhoId },
    });
  }

  async findItemCarrinho(
    carrinhoId: string,
    produtoId: string,
    variacaoId?: string,
  ): Promise<ItensCarrinhoEntity | null> {
    const where: {
      carrinho_id: string;
      produto_id: string;
      variacao_id?: string;
    } = { carrinho_id: carrinhoId, produto_id: produtoId };
    if (variacaoId) {
      where.variacao_id = variacaoId;
    }
    return this.itensCarrinhoRepository.findOne({ where });
  }

  async createItemCarrinho(
    item: Partial<ItensCarrinhoEntity>,
  ): Promise<ItensCarrinhoEntity> {
    return this.itensCarrinhoRepository.save(item);
  }

  async updateItemCarrinho(
    id: string,
    data: Partial<ItensCarrinhoEntity>,
  ): Promise<void> {
    await this.itensCarrinhoRepository.update(id, data);
  }

  async deleteItemCarrinho(id: string): Promise<void> {
    await this.itensCarrinhoRepository.delete(id);
  }

  async deleteItensCarrinho(carrinhoId: string): Promise<void> {
    await this.itensCarrinhoRepository.delete({ carrinho_id: carrinhoId });
  }

  async findProdutoById(id: string): Promise<ProdutosEntity | null> {
    return this.produtosRepository.findOne({ where: { id } });
  }

  async findProdutos(params: {
    categoriaId?: string;
    busca?: string;
    skip: number;
    take: number;
  }): Promise<[ProdutosEntity[], number]> {
    const { categoriaId, busca, skip, take } = params;
    const where: FindOptionsWhere<ProdutosEntity> = { ativo: true };

    if (categoriaId) {
      where.categoriaId = categoriaId;
    }

    if (busca) {
      where.nome = Like(`%${busca}%`) as any;
    }

    return this.produtosRepository.findAndCount({
      where,
      skip,
      take,
      order: { criadoEm: 'DESC' },
    });
  }

  async findVariacaoById(id: string): Promise<VariacoesProdutoEntity | null> {
    return this.variacoesRepository.findOne({ where: { id } });
  }

  async findVariacoesByProduto(
    produtoId: string,
  ): Promise<VariacoesProdutoEntity[]> {
    return this.variacoesRepository.find({
      where: { produto_id: produtoId },
      order: { ordem: 'ASC' },
    });
  }

  async findImagensByProduto(
    produtoId: string,
  ): Promise<ImagensProdutoEntity[]> {
    return this.imagensRepository.find({
      where: { produto_id: produtoId },
      order: { ordem: 'ASC' },
    });
  }

  async findFavorito(
    usuarioId: string,
    produtoId: string,
  ): Promise<FavoritosEntity | null> {
    return this.favoritosRepository.findOne({
      where: { usuario_id: usuarioId, produto_id: produtoId },
    });
  }

  async createFavorito(
    favorito: Partial<FavoritosEntity>,
  ): Promise<FavoritosEntity> {
    return this.favoritosRepository.save(favorito);
  }

  async deleteFavorito(id: string): Promise<void> {
    await this.favoritosRepository.delete(id);
  }

  async findFavoritosByUsuario(usuarioId: string): Promise<FavoritosEntity[]> {
    return this.favoritosRepository.find({
      where: { usuario_id: usuarioId },
      order: { criado_em: 'DESC' },
    });
  }

  async createProduto(
    produto: Partial<ProdutosEntity>,
  ): Promise<ProdutosEntity> {
    return this.produtosRepository.save(produto);
  }

  async findProdutoBySku(sku: string): Promise<ProdutosEntity | null> {
    return this.produtosRepository.findOne({ where: { sku } });
  }

  async createCategoria(
    categoria: Partial<CategoriasEntity>,
  ): Promise<CategoriasEntity> {
    return this.categoriasRepository.save(categoria);
  }

  async findCategoriaBySlug(slug: string): Promise<CategoriasEntity | null> {
    return this.categoriasRepository.findOne({ where: { slug } });
  }

  async findCategoriaById(id: string): Promise<CategoriasEntity | null> {
    return this.categoriasRepository.findOne({ where: { id } });
  }

  async findAllCategorias(): Promise<CategoriasEntity[]> {
    return this.categoriasRepository.find({
      order: { ordem: 'ASC', nome: 'ASC' },
    });
  }

  async updateCategoria(
    id: string,
    data: Partial<CategoriasEntity>,
  ): Promise<void> {
    await this.categoriasRepository.update(id, data);
  }

  async deleteCategoria(id: string): Promise<void> {
    await this.categoriasRepository.delete(id);
  }

  async createVariacao(
    variacao: Partial<VariacoesProdutoEntity>,
  ): Promise<VariacoesProdutoEntity> {
    return this.variacoesRepository.save(variacao);
  }

  async findVariacaoBySku(sku: string): Promise<VariacoesProdutoEntity | null> {
    return this.variacoesRepository.findOne({ where: { sku } });
  }

  async findAllVariacoesByProduto(
    produtoId: string,
  ): Promise<VariacoesProdutoEntity[]> {
    return this.variacoesRepository.find({
      where: { produto_id: produtoId },
      order: { ordem: 'ASC' },
    });
  }

  async updateVariacao(
    id: string,
    data: Partial<VariacoesProdutoEntity>,
  ): Promise<void> {
    await this.variacoesRepository.update(id, data);
  }

  async deleteVariacao(id: string): Promise<void> {
    await this.variacoesRepository.delete(id);
  }

  async createImagem(
    imagem: Partial<ImagensProdutoEntity>,
  ): Promise<ImagensProdutoEntity> {
    return this.imagensRepository.save(imagem);
  }

  async findImagemById(id: string): Promise<ImagensProdutoEntity | null> {
    return this.imagensRepository.findOne({ where: { id } });
  }

  async findAllImagensByProduto(
    produtoId: string,
  ): Promise<ImagensProdutoEntity[]> {
    return this.imagensRepository.find({
      where: { produto_id: produtoId },
      order: { ordem: 'ASC' },
    });
  }

  async deleteImagem(id: string): Promise<void> {
    await this.imagensRepository.delete(id);
  }
}
