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
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column({ type: 'uuid' })
  uuid: string;

  @Index()
  @Column({ type: 'bigint', name: 'vendedor_id' })
  vendedorId: string;

  @Index()
  @Column({ type: 'bigint', name: 'categoria_id' })
  categoriaId: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 50 })
  sku: string;

  @Column({ type: 'varchar', length: 255 })
  nome: string;

  @Column({ type: 'text' })
  descricao: string;

  @Column({ type: 'varchar', length: 500, name: 'descricao_curta' })
  descricaoCurta: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  preco: string;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    name: 'preco_promocional',
  })
  precoPromocional: string;

  @Column({ type: 'decimal', precision: 8, scale: 3, name: 'peso_kg' })
  pesoKg: string;

  @Column({ type: 'decimal', precision: 6, scale: 2, name: 'altura_cm' })
  alturaCm: string;

  @Column({ type: 'decimal', precision: 6, scale: 2, name: 'largura_cm' })
  larguraCm: string;

  @Column({ type: 'decimal', precision: 6, scale: 2, name: 'profundidade_cm' })
  profundidadeCm: string;

  @Column({ type: 'int' })
  estoque: number;

  @Column({ type: 'int', name: 'estoque_minimo' })
  estoqueMinimo: number;

  @Column({ type: 'int' })
  vendidos: number;

  @Column({ type: 'int' })
  visualizacoes: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, name: 'avaliacao_media' })
  avaliacaoMedia: string;

  @Column({ type: 'int', name: 'total_avaliacoes' })
  totalAvaliacoes: number;

  @Column({ type: 'text' })
  tags: string;

  @Index()
  @Column({ type: 'boolean' })
  ativo: boolean;

  @Index()
  @Column({ type: 'boolean' })
  destaque: boolean;

  @CreateDateColumn({ type: 'timestamp', name: 'criado_em' })
  criadoEm: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'atualizado_em' })
  atualizadoEm: Date;
}
