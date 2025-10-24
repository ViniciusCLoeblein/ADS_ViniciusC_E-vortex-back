import { ApiProperty } from '@nestjs/swagger';

export class ProdutoCriadoRes {
  @ApiProperty()
  id: string;

  @ApiProperty()
  uuid: string;

  @ApiProperty()
  vendedorId: string;

  @ApiProperty()
  categoriaId: string;

  @ApiProperty()
  sku: string;

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
  pesoKg: string;

  @ApiProperty()
  alturaCm: string;

  @ApiProperty()
  larguraCm: string;

  @ApiProperty()
  profundidadeCm: string;

  @ApiProperty()
  estoque: number;

  @ApiProperty()
  estoqueMinimo: number;

  @ApiProperty()
  vendidos: number;

  @ApiProperty()
  visualizacoes: number;

  @ApiProperty()
  avaliacaoMedia: string;

  @ApiProperty()
  totalAvaliacoes: number;

  @ApiProperty()
  tags: string;

  @ApiProperty()
  ativo: boolean;

  @ApiProperty()
  destaque: boolean;

  @ApiProperty()
  criadoEm: Date;

  @ApiProperty()
  atualizadoEm: Date;
}
