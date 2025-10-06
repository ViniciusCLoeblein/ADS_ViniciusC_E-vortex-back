import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('cupons')
export class CuponsEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 50 })
  codigo: string;

  @Column({ type: 'varchar', length: 255 })
  descricao: string;

  @Column({ type: 'varchar', length: 20 })
  tipo: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  valor: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'valor_minimo',
    nullable: true,
  })
  valor_minimo: string | null;

  @Column({ type: 'int', name: 'usos_maximos', nullable: true })
  usos_maximos: number | null;

  @Column({ type: 'int', name: 'usos_atuais', default: 0 })
  usos_atuais: number;

  @Index()
  @Column({ type: 'bigint', name: 'usuario_id', nullable: true })
  usuario_id: string | null;

  @Column({ type: 'timestamp', name: 'data_inicio', nullable: true })
  data_inicio: Date | null;

  @Index()
  @Column({ type: 'timestamp', name: 'data_expiracao', nullable: true })
  data_expiracao: Date | null;

  @Index()
  @Column({ type: 'boolean' })
  ativo: boolean;

  @CreateDateColumn({ type: 'timestamp', name: 'criado_em' })
  criado_em: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'atualizado_em' })
  atualizado_em: Date;
}
