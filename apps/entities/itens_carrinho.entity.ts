import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('itens_carrinho')
export class ItensCarrinhoEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Index()
  @Column({ type: 'bigint', name: 'carrinho_id' })
  carrinho_id: string;

  @Column({ type: 'bigint', name: 'produto_id' })
  produto_id: string;

  @Column({ type: 'bigint', name: 'variacao_id', nullable: true })
  variacao_id: string | null;

  @Column({ type: 'int' })
  quantidade: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'preco_unitario' })
  preco_unitario: string;

  @CreateDateColumn({ type: 'timestamp', name: 'adicionado_em' })
  adicionado_em: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'atualizado_em' })
  atualizado_em: Date;
}
