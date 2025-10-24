import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('transacoes_pagamento')
export class TransacoesPagamentoEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Index()
  @Column({ type: 'bigint', name: 'pedido_id' })
  pedido_id: string;

  @Index()
  @Column({ type: 'bigint', name: 'usuario_id' })
  usuario_id: string;

  @Column({ type: 'varchar', length: 50, name: 'gateway_pagamento' })
  gateway_pagamento: string;

  @Index()
  @Column({ type: 'varchar', length: 255, name: 'id_transacao_gateway' })
  id_transacao_gateway: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  valor: string;

  @Index()
  @Column({ type: 'varchar', length: 20 })
  status: string;

  @Column({ type: 'varchar', length: 100, name: 'codigo_erro', nullable: true })
  codigo_erro: string | null;

  @Column({ type: 'text', name: 'mensagem_erro', nullable: true })
  mensagem_erro: string | null;

  @Column({ type: 'jsonb', name: 'dados_transacao', nullable: true })
  dados_transacao: any;

  @CreateDateColumn({ type: 'timestamp', name: 'criado_em' })
  criado_em: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'atualizado_em' })
  atualizado_em: Date;
}
