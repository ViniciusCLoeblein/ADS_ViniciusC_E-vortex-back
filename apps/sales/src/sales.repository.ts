import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CarrinhosEntity } from 'apps/entities/carrinhos.entity';
import { ItensCarrinhoEntity } from 'apps/entities/itens_carrinho.entity';
import { ProdutosEntity } from 'apps/entities/produtos.entity';
import { VariacoesProdutoEntity } from 'apps/entities/variacoes_produto.entity';
import { ImagensProdutoEntity } from 'apps/entities/imagens_produto.entity';
import { FavoritosEntity } from 'apps/entities/favoritos.entity';
import { Repository, Like } from 'typeorm';

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
  ) {}

  // Carrinho
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

  // Itens do Carrinho
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
    const where: any = { carrinho_id: carrinhoId, produto_id: produtoId };
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

  // Produtos
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
    const where: any = { ativo: true };

    if (categoriaId) {
      where.categoriaId = categoriaId;
    }

    if (busca) {
      where.nome = Like(`%${busca}%`);
    }

    return this.produtosRepository.findAndCount({
      where,
      skip,
      take,
      order: { criadoEm: 'DESC' },
    });
  }

  // Variações
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

  // Imagens
  async findImagensByProduto(
    produtoId: string,
  ): Promise<ImagensProdutoEntity[]> {
    return this.imagensRepository.find({
      where: { produto_id: produtoId },
      order: { ordem: 'ASC' },
    });
  }

  // Favoritos
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
}
