import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
} from 'typeorm';

@Entity('favoritos')
export class FavoritosEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Index()
  @Column({ type: 'bigint', name: 'usuario_id' })
  usuario_id: string;

  @Index()
  @Column({ type: 'bigint', name: 'produto_id' })
  produto_id: string;

  @CreateDateColumn({ type: 'timestamp', name: 'criado_em' })
  criado_em: Date;
}
