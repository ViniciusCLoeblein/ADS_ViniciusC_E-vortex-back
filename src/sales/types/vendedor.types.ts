import { ApiProperty } from '@nestjs/swagger';

export class VendedorPublicoRes {
  @ApiProperty({ description: 'ID do vendedor', example: '1' })
  id: string;

  @ApiProperty({
    description: 'UUID do vendedor',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  uuid: string;

  @ApiProperty({
    description: 'Nome fantasia da loja',
    example: 'Silva Store',
  })
  nomeFantasia: string;

  @ApiProperty({
    description: 'Razão social da empresa',
    example: 'João Silva LTDA',
  })
  razaoSocial: string;

  @ApiProperty({
    description: 'Status do vendedor',
    example: 'aprovado',
  })
  status: string;

  @ApiProperty({
    description: 'Data de aprovação',
    example: '2024-01-15T10:30:00Z',
    nullable: true,
  })
  dataAprovacao: Date | null;

  @ApiProperty({
    description: 'Data de criação',
    example: '2024-01-10T10:30:00Z',
  })
  criadoEm: Date;
}

export class ListaVendedoresRes {
  @ApiProperty({
    description: 'Lista de vendedores',
    type: [VendedorPublicoRes],
  })
  vendedores: VendedorPublicoRes[];

  @ApiProperty({ description: 'Total de vendedores', example: 100 })
  total: number;

  @ApiProperty({ description: 'Página atual', example: 1 })
  pagina: number;

  @ApiProperty({ description: 'Itens por página', example: 20 })
  limite: number;

  @ApiProperty({ description: 'Total de páginas', example: 5 })
  totalPaginas: number;
}

