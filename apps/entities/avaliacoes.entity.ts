import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('avaliacoes')
export class AvaliacoesEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Index()
  @Column({ type: 'bigint', name: 'pedido_id' })
  pedido_id: string;

  @Index()
  @Column({ type: 'bigint', name: 'produto_id' })
  produto_id: string;

  @Index()
  @Column({ type: 'bigint', name: 'usuario_id' })
  usuario_id: string;

  @Index()
  @Column({ type: 'int' })
  nota: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  titulo: string | null;

  @Column({ type: 'text', nullable: true })
  comentario: string | null;

  @Index()
  @Column({ type: 'boolean', nullable: true })
  aprovada: boolean | null;

  @Column({ type: 'text', name: 'resposta_vendedor', nullable: true })
  resposta_vendedor: string | null;

  @Column({ type: 'timestamp', name: 'data_resposta', nullable: true })
  data_resposta: Date | null;

  @CreateDateColumn({ type: 'timestamp', name: 'criado_em' })
  criado_em: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'atualizado_em' })
  atualizado_em: Date;
}
