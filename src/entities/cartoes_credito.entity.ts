import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('cartoes_credito')
export class CartoesCreditoEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Index()
  @Column({ type: 'bigint', name: 'usuario_id' })
  usuario_id: string;

  @Index({ unique: true })
  @Column({ type: 'uuid' })
  uuid: string;

  @Column({ type: 'varchar', length: 100 })
  titular: string;

  @Column({ type: 'varchar', length: 255, name: 'numero_hash' })
  numero_hash: string;

  @Column({ type: 'varchar', length: 4, name: 'ultimos_digitos' })
  ultimos_digitos: string;

  @Column({ type: 'varchar', length: 20 })
  bandeira: string;

  @Column({ type: 'int', name: 'mes_validade' })
  mes_validade: number;

  @Column({ type: 'int', name: 'ano_validade' })
  ano_validade: number;

  @Column({ type: 'varchar', length: 255, name: 'cvv_hash' })
  cvv_hash: string;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'token_gateway',
    nullable: true,
  })
  token_gateway: string | null;

  @Index()
  @Column({ type: 'boolean' })
  principal: boolean;

  @Index()
  @Column({ type: 'boolean' })
  ativo: boolean;

  @CreateDateColumn({ type: 'timestamp', name: 'criado_em' })
  criado_em: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'atualizado_em' })
  atualizado_em: Date;
}
