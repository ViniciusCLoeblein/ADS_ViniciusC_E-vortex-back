import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
} from 'typeorm';

@Entity('imagens_produto')
export class ImagensProdutoEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Index()
  @Column({ type: 'bigint', name: 'produto_id' })
  produto_id: string;

  @Column({ type: 'varchar', length: 500 })
  url: string;

  @Column({ type: 'varchar', length: 20 })
  tipo: string;

  @Index()
  @Column({ type: 'int' })
  ordem: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  legenda: string | null;

  @CreateDateColumn({ type: 'timestamp', name: 'criado_em' })
  criado_em: Date;
}
