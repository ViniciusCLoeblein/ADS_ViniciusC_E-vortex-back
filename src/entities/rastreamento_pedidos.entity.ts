import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
} from 'typeorm';

@Entity('rastreamento_pedidos')
export class RastreamentoPedidosEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Index()
  @Column({ type: 'bigint', name: 'pedido_id' })
  pedido_id: string;

  @Column({ type: 'varchar', length: 100 })
  status: string;

  @Column({ type: 'text', nullable: true })
  descricao: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  localizacao: string | null;

  @Index()
  @Column({ type: 'timestamp', name: 'data_ocorrencia' })
  data_ocorrencia: Date;

  @CreateDateColumn({ type: 'timestamp', name: 'criado_em' })
  criado_em: Date;
}
