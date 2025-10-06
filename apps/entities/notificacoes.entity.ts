import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('notificacoes')
export class NotificacoesEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Index()
  @Column({ type: 'bigint', name: 'usuario_id' })
  usuario_id: string;

  @Index()
  @Column({ type: 'varchar', length: 20 })
  tipo: string;

  @Column({ type: 'varchar', length: 255 })
  titulo: string;

  @Column({ type: 'text' })
  mensagem: string;

  @Column({ type: 'varchar', length: 500, name: 'url_acao', nullable: true })
  url_acao: string | null;

  @Index()
  @Column({ type: 'boolean' })
  lida: boolean;

  @Column({ type: 'timestamp', name: 'data_leitura', nullable: true })
  data_leitura: Date | null;

  @Index()
  @Column({ type: 'timestamp', name: 'enviada_em', nullable: true })
  enviada_em: Date | null;

  @Column({ type: 'timestamp', name: 'agendada_para', nullable: true })
  agendada_para: Date | null;
}
