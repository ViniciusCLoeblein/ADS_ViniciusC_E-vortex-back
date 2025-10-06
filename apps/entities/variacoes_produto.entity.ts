import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
} from 'typeorm';

@Entity('variacoes_produto')
export class VariacoesProdutoEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Index()
  @Column({ type: 'bigint', name: 'produto_id' })
  produto_id: string;

  @Column({ type: 'varchar', length: 50 })
  tipo: string;

  @Column({ type: 'varchar', length: 100 })
  valor: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 50 })
  sku: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'preco_adicional' })
  preco_adicional: string;

  @Column({ type: 'int' })
  estoque: number;

  @Column({ type: 'int' })
  ordem: number;

  @CreateDateColumn({ type: 'timestamp', name: 'criado_em' })
  criado_em: Date;
}
