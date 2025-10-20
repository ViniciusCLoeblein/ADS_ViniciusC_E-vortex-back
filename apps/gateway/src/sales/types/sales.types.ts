import { ApiProperty } from '@nestjs/swagger';

export class ProdutoInfo {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nome: string;

  @ApiProperty()
  sku: string;

  @ApiProperty()
  preco: string;

  @ApiProperty()
  precoPromocional: string;
}

export class VariacaoInfo {
  @ApiProperty()
  id: string;

  @ApiProperty()
  tipo: string;

  @ApiProperty()
  valor: string;

  @ApiProperty()
  precoAdicional: string;
}

export class ItemCarrinhoRes {
  @ApiProperty()
  id: string;

  @ApiProperty()
  produtoId: string;

  @ApiProperty({ nullable: true })
  variacaoId: string | null;

  @ApiProperty()
  quantidade: number;

  @ApiProperty()
  precoUnitario: string;

  @ApiProperty({ type: ProdutoInfo, nullable: true })
  produto: ProdutoInfo | null;

  @ApiProperty({ type: VariacaoInfo, nullable: true })
  variacao: VariacaoInfo | null;
}

export class CarrinhoRes {
  @ApiProperty()
  carrinhoId: string;

  @ApiProperty({ type: [ItemCarrinhoRes] })
  itens: ItemCarrinhoRes[];

  @ApiProperty()
  total: number;
}

export class ProdutoResumoRes {
  @ApiProperty()
  id: string;

  @ApiProperty()
  uuid: string;

  @ApiProperty()
  nome: string;

  @ApiProperty()
  descricaoCurta: string;

  @ApiProperty()
  preco: string;

  @ApiProperty()
  precoPromocional: string;

  @ApiProperty()
  avaliacaoMedia: string;

  @ApiProperty()
  totalAvaliacoes: number;

  @ApiProperty()
  estoque: number;
}

export class ProdutoListagemRes {
  @ApiProperty({ type: [ProdutoResumoRes] })
  produtos: ProdutoResumoRes[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  pagina: number;

  @ApiProperty()
  limite: number;

  @ApiProperty()
  totalPaginas: number;
}

export class VariacaoProdutoRes {
  @ApiProperty()
  id: string;

  @ApiProperty()
  tipo: string;

  @ApiProperty()
  valor: string;

  @ApiProperty()
  sku: string;

  @ApiProperty()
  precoAdicional: string;

  @ApiProperty()
  estoque: number;
}

export class ImagemProdutoRes {
  @ApiProperty()
  id: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  tipo: string;

  @ApiProperty({ nullable: true })
  legenda: string | null;
}

export class ProdutoDetalheRes {
  @ApiProperty()
  id: string;

  @ApiProperty()
  uuid: string;

  @ApiProperty()
  nome: string;

  @ApiProperty()
  descricao: string;

  @ApiProperty()
  descricaoCurta: string;

  @ApiProperty()
  preco: string;

  @ApiProperty()
  precoPromocional: string;

  @ApiProperty()
  estoque: number;

  @ApiProperty()
  sku: string;

  @ApiProperty()
  avaliacaoMedia: string;

  @ApiProperty()
  totalAvaliacoes: number;

  @ApiProperty({ type: [VariacaoProdutoRes] })
  variacoes: VariacaoProdutoRes[];

  @ApiProperty({ type: [ImagemProdutoRes] })
  imagens: ImagemProdutoRes[];
}

export class ProdutoFavoritoInfo {
  @ApiProperty()
  id: string;

  @ApiProperty()
  nome: string;

  @ApiProperty()
  descricaoCurta: string;

  @ApiProperty()
  preco: string;

  @ApiProperty()
  precoPromocional: string;

  @ApiProperty()
  avaliacaoMedia: string;
}

export class FavoritoItemRes {
  @ApiProperty()
  id: string;

  @ApiProperty()
  produtoId: string;

  @ApiProperty()
  criadoEm: Date;

  @ApiProperty({ type: ProdutoFavoritoInfo, nullable: true })
  produto: ProdutoFavoritoInfo | null;
}

export class FavoritosRes {
  @ApiProperty({ type: [FavoritoItemRes] })
  favoritos: FavoritoItemRes[];
}

export class MessageRes {
  @ApiProperty()
  message: string;
}
