import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('categorias')
@Unique(['slug'])
export class CategoriasEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column({ type: 'uuid' })
  uuid: string;

  @Column({ type: 'varchar', length: 100 })
  nome: string;

  @Column({ type: 'text' })
  descricao: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 120 })
  slug: string;

  @Column({ type: 'varchar', length: 50 })
  icone: string;

  @Column({ type: 'varchar', length: 7, name: 'cor_hex' })
  cor_hex: string;

  @Column({ type: 'int' })
  ordem: number;

  @Index()
  @Column({ type: 'bigint', name: 'categoria_pai_id' })
  categoria_pai_id: string;

  @Index()
  @Column({ type: 'boolean' })
  ativo: boolean;

  @CreateDateColumn({ type: 'timestamp', name: 'criado_em' })
  criado_em: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'atualizado_em' })
  atualizado_em: Date;
}
