import { ApiProperty } from '@nestjs/swagger';

export class CategoriaRes {
  @ApiProperty()
  id: string;

  @ApiProperty()
  uuid: string;

  @ApiProperty()
  nome: string;

  @ApiProperty()
  descricao: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  icone: string;

  @ApiProperty()
  cor_hex: string;

  @ApiProperty()
  ordem: number;

  @ApiProperty({ nullable: true })
  categoria_pai_id: string | null;

  @ApiProperty()
  ativo: boolean;

  @ApiProperty()
  criado_em: Date;

  @ApiProperty()
  atualizado_em: Date;
}

export class ListaCategoriasRes {
  @ApiProperty({ type: [CategoriaRes] })
  categorias: CategoriaRes[];

  @ApiProperty()
  total: number;
}
