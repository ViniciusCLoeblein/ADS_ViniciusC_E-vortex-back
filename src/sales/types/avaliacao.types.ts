import { ApiProperty } from '@nestjs/swagger';

export class AvaliacaoCriadaRes {
  @ApiProperty({ description: 'ID da avaliação', example: '1' })
  id: string;

  @ApiProperty({ description: 'ID do pedido', example: '1' })
  pedidoId: string;

  @ApiProperty({ description: 'ID do produto', example: '1' })
  produtoId: string;

  @ApiProperty({ description: 'ID do usuário', example: '1' })
  usuarioId: string;

  @ApiProperty({ description: 'Nota da avaliação', example: 5 })
  nota: number;

  @ApiProperty({
    description: 'Título da avaliação',
    example: 'Excelente produto!',
    nullable: true,
  })
  titulo: string | null;

  @ApiProperty({
    description: 'Comentário da avaliação',
    example: 'Produto chegou rápido e em perfeito estado.',
    nullable: true,
  })
  comentario: string | null;

  @ApiProperty({
    description: 'Status de aprovação',
    example: null,
    nullable: true,
  })
  aprovada: boolean | null;

  @ApiProperty({
    description: 'Data de criação',
  })
  criadoEm: Date;
}

export class AvaliacaoRes {
  @ApiProperty({ description: 'ID da avaliação', example: '1' })
  id: string;

  @ApiProperty({ description: 'ID do produto', example: '1' })
  produtoId: string;

  @ApiProperty({ description: 'Nota da avaliação', example: 5 })
  nota: number;

  @ApiProperty({
    description: 'Título da avaliação',
    example: 'Excelente produto!',
    nullable: true,
  })
  titulo: string | null;

  @ApiProperty({
    description: 'Comentário da avaliação',
    example: 'Produto chegou rápido e em perfeito estado.',
    nullable: true,
  })
  comentario: string | null;

  @ApiProperty({
    description: 'Resposta do vendedor',
    nullable: true,
  })
  respostaVendedor: string | null;

  @ApiProperty({
    description: 'Data de resposta',
    nullable: true,
  })
  dataResposta: Date | null;

  @ApiProperty({
    description: 'Data de criação',
  })
  criadoEm: Date;
}

export class ListaAvaliacoesRes {
  @ApiProperty({ description: 'Lista de avaliações', type: [AvaliacaoRes] })
  avaliacoes: AvaliacaoRes[];

  @ApiProperty({ description: 'Total de avaliações', example: 10 })
  total: number;
}
