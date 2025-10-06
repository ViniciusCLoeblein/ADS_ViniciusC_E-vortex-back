import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('usuarios')
@Index('IDX_USUARIOS_EMAIL', ['email'], { unique: true })
@Index('IDX_USUARIOS_UUID', ['uuid'], { unique: true })
@Index('IDX_USUARIOS_CPF', ['cpf'], { unique: true })
@Index('IDX_USUARIOS_TIPO', ['tipo'])
export class UsuariosEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ type: 'uuid' })
  uuid: string;

  @Column({ type: 'varchar', length: 100 })
  nome: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ name: 'senha_hash', type: 'varchar', length: 255 })
  senhaHash: string;

  @Column({ type: 'varchar', length: 11, unique: true })
  cpf: string;

  @Column({ type: 'varchar', length: 20 })
  tipo: string;

  @Column({ name: 'email_verificado', type: 'boolean' })
  emailVerificado: boolean;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefone: string;

  @Column({ name: 'avatar_url', type: 'varchar', length: 500, nullable: true })
  avatarUrl: string;

  @Column({ name: 'data_nascimento', type: 'date', nullable: true })
  dataNascimento: Date | string;

  @Column({ name: 'aceita_marketing', type: 'boolean', default: false })
  aceitaMarketing: boolean;

  @Column({ name: 'ultimo_login', type: 'timestamp', nullable: true })
  ultimoLogin: Date;

  @CreateDateColumn({ name: 'criado_em', type: 'timestamp' })
  criadoEm: Date;

  @UpdateDateColumn({ name: 'atualizado_em', type: 'timestamp' })
  atualizadoEm: Date;

  @Column({ name: 'excluido_em', type: 'timestamp', nullable: true })
  excluidoEm: Date;
}
