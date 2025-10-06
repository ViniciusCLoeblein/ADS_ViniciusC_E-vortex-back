import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('enderecos')
export class EnderecosEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Index()
  @Column({ type: 'bigint', name: 'usuario_id' })
  usuario_id: string;

  @Column({ type: 'varchar', length: 50 })
  apelido: string;

  @Column({ type: 'varchar', length: 8 })
  cep: string;

  @Column({ type: 'varchar', length: 255 })
  logradouro: string;

  @Column({ type: 'varchar', length: 20 })
  numero: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  complemento: string | null;

  @Column({ type: 'varchar', length: 100 })
  bairro: string;

  @Column({ type: 'varchar', length: 100 })
  cidade: string;

  @Column({ type: 'char', length: 2 })
  estado: string;

  @Column({ type: 'char', length: 2 })
  pais: string;

  @Index()
  @Column({ type: 'boolean' })
  principal: boolean;

  @CreateDateColumn({ type: 'timestamp', name: 'criado_em' })
  criado_em: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'atualizado_em' })
  atualizado_em: Date;
}
