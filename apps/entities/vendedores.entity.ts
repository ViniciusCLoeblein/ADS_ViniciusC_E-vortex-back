import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('vendedores')
@Unique(['cnpj'])
@Unique(['usuario_id'])
export class VendedoresEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column({ type: 'bigint', name: 'usuario_id' })
  usuario_id: string;

  @Column({ type: 'uuid' })
  uuid: string;

  @Column({ type: 'varchar', length: 14 })
  cnpj: string;

  @Column({ type: 'varchar', length: 255, name: 'razao_social' })
  razao_social: string;

  @Column({ type: 'varchar', length: 255, name: 'nome_fantasia' })
  nome_fantasia: string;

  @Column({ type: 'varchar', length: 20, name: 'inscricao_estadual' })
  inscricao_estadual: string;

  @Column({ type: 'jsonb', name: 'conta_bancaria', nullable: true })
  conta_bancaria: any;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    name: 'comissao_percentual',
  })
  comissao_percentual: string;

  @Index()
  @Column({ type: 'varchar', length: 20 })
  status: string;

  @Column({ type: 'text', name: 'motivo_rejeicao', nullable: true })
  motivo_rejeicao: string | null;

  @Column({ type: 'timestamp', name: 'data_aprovacao', nullable: true })
  data_aprovacao: Date | null;

  @Column({
    type: 'varchar',
    length: 10,
    name: 'termos_versao',
    nullable: true,
  })
  termos_versao: string | null;

  @Column({ type: 'timestamp', name: 'termos_aceito_em', nullable: true })
  termos_aceito_em: Date | null;

  @CreateDateColumn({ type: 'timestamp', name: 'criado_em' })
  criado_em: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'atualizado_em' })
  atualizado_em: Date;
}
