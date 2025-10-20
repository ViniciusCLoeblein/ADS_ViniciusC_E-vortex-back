import { ApiProperty } from '@nestjs/swagger';

export class VariacaoRes {
  @ApiProperty()
  id: string;

  @ApiProperty()
  produto_id: string;

  @ApiProperty()
  tipo: string;

  @ApiProperty()
  valor: string;

  @ApiProperty()
  sku: string;

  @ApiProperty()
  preco_adicional: string;

  @ApiProperty()
  estoque: number;

  @ApiProperty()
  ordem: number;

  @ApiProperty()
  criado_em: Date;
}

export class ListaVariacoesRes {
  @ApiProperty({ type: [VariacaoRes] })
  variacoes: VariacaoRes[];

  @ApiProperty()
  total: number;
}
