import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('carrinhos')
export class CarrinhosEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Index()
  @Column({ type: 'bigint', name: 'usuario_id', nullable: true })
  usuario_id: string | null;

  @Index()
  @Column({ type: 'varchar', length: 100, name: 'sessao_id', nullable: true })
  sessao_id: string | null;

  @Column({ type: 'boolean' })
  ativo: boolean;

  @CreateDateColumn({ type: 'timestamp', name: 'criado_em' })
  criado_em: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'atualizado_em' })
  atualizado_em: Date;

  @Column({ type: 'timestamp', name: 'expira_em', nullable: true })
  expira_em: Date | null;
}
