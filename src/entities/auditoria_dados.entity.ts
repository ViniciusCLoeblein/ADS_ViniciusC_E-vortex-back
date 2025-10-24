import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
} from 'typeorm';

@Entity('auditoria_dados')
export class AuditoriaDadosEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 50 })
  tabela: string;

  @Index()
  @Column({ type: 'bigint', name: 'registro_id' })
  registro_id: string;

  @Column({ type: 'varchar', length: 10 })
  acao: string;

  @Index()
  @Column({ type: 'bigint', name: 'usuario_id', nullable: true })
  usuario_id: string | null;

  @Column({ type: 'jsonb', name: 'dados_anteriores', nullable: true })
  dados_anteriores: any;

  @Column({ type: 'jsonb', name: 'dados_novos', nullable: true })
  dados_novos: any;

  @Column({ type: 'varchar', length: 45, name: 'ip_conexao', nullable: true })
  ip_conexao: string | null;

  @Column({ type: 'text', name: 'user_agent', nullable: true })
  user_agent: string | null;

  @Index()
  @CreateDateColumn({ type: 'timestamp', name: 'criado_em' })
  criado_em: Date;
}
