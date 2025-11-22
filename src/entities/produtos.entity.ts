import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('produtos')
@Unique(['sku'])
export class ProdutosEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @ApiProperty()
  @Column({ type: 'uuid' })
  uuid: string;

  @ApiProperty()
  @Index()
  @Column({ type: 'bigint', name: 'vendedor_id' })
  vendedorId: string;

  @ApiProperty()
  @Index()
  @Column({ type: 'bigint', name: 'categoria_id' })
  categoriaId: string;

  @ApiProperty()
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 50 })
  sku: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  nome: string;

  @ApiProperty()
  @Column({ type: 'text' })
  descricao: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 500, name: 'descricao_curta' })
  descricaoCurta: string;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  preco: string;

  @ApiProperty()
  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    name: 'preco_promocional',
  })
  precoPromocional: string;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 8, scale: 3, name: 'peso_kg' })
  pesoKg: string;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 6, scale: 2, name: 'altura_cm' })
  alturaCm: string;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 6, scale: 2, name: 'largura_cm' })
  larguraCm: string;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 6, scale: 2, name: 'profundidade_cm' })
  profundidadeCm: string;

  @ApiProperty()
  @Column({ type: 'int' })
  estoque: number;

  @ApiProperty()
  @Column({ type: 'int', name: 'estoque_minimo' })
  estoqueMinimo: number;

  @ApiProperty()
  @Column({ type: 'int' })
  vendidos: number;

  @ApiProperty()
  @Column({ type: 'int' })
  visualizacoes: number;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 3, scale: 2, name: 'avaliacao_media' })
  avaliacaoMedia: string;

  @ApiProperty()
  @Column({ type: 'int', name: 'total_avaliacoes' })
  totalAvaliacoes: number;

  @ApiProperty()
  @Column({ type: 'text' })
  tags: string;

  @ApiProperty()
  @Index()
  @Column({ type: 'boolean' })
  ativo: boolean;

  @ApiProperty()
  @Index()
  @Column({ type: 'boolean' })
  destaque: boolean;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamp', name: 'criado_em' })
  criadoEm: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: 'timestamp', name: 'atualizado_em' })
  atualizadoEm: Date;
}
