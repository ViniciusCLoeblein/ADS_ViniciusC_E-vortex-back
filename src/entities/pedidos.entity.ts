import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('pedidos')
export class PedidosEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Index({ unique: true })
  @Column({ type: 'uuid' })
  uuid: string;

  @Index()
  @Column({ type: 'bigint', name: 'usuario_id' })
  usuario_id: string;

  @Column({ type: 'bigint', name: 'endereco_entrega_id' })
  endereco_entrega_id: string;

  @Column({ type: 'bigint', name: 'cartao_credito_id', nullable: true })
  cartao_credito_id: string | null;

  @Index()
  @Column({ type: 'varchar', length: 20 })
  status: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  subtotal: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  desconto: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  frete: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  total: string;

  @Column({ type: 'varchar', length: 20, name: 'metodo_pagamento' })
  metodo_pagamento: string;

  @Column({ type: 'jsonb', name: 'dados_pagamento', nullable: true })
  dados_pagamento: Record<string, unknown> | null;

  @Column({
    type: 'varchar',
    length: 100,
    name: 'codigo_rastreamento',
    nullable: true,
  })
  codigo_rastreamento: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  transportadora: string | null;

  @Column({ type: 'date', name: 'previsao_entrega', nullable: true })
  previsao_entrega: string | Date | null;

  @Column({ type: 'timestamp', name: 'data_pagamento', nullable: true })
  data_pagamento: Date | null;

  @Column({ type: 'timestamp', name: 'data_envio', nullable: true })
  data_envio: Date | null;

  @Column({ type: 'timestamp', name: 'data_entrega', nullable: true })
  data_entrega: Date | null;

  @Column({ type: 'timestamp', name: 'data_cancelamento', nullable: true })
  data_cancelamento: Date | null;

  @Column({ type: 'text', name: 'motivo_cancelamento', nullable: true })
  motivo_cancelamento: string | null;

  @CreateDateColumn({ type: 'timestamp', name: 'criado_em' })
  criado_em: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'atualizado_em' })
  atualizado_em: Date;
}
