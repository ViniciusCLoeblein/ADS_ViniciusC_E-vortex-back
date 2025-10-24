import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
} from 'typeorm';

@Entity('logs_estoque')
export class LogsEstoqueEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Index()
  @Column({ type: 'bigint', name: 'produto_id' })
  produto_id: string;

  @Column({ type: 'bigint', name: 'variacao_id', nullable: true })
  variacao_id: string | null;

  @Index()
  @Column({ type: 'varchar', length: 20, name: 'tipo_movimentacao' })
  tipo_movimentacao: string;

  @Column({ type: 'int' })
  quantidade: number;

  @Column({ type: 'int', name: 'estoque_anterior' })
  estoque_anterior: number;

  @Column({ type: 'int', name: 'estoque_atual' })
  estoque_atual: number;

  @Column({ type: 'bigint', name: 'pedido_id', nullable: true })
  pedido_id: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  motivo: string | null;

  @Index()
  @CreateDateColumn({ type: 'timestamp', name: 'criado_em' })
  criado_em: Date;
}
