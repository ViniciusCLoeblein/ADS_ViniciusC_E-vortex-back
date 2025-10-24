import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('itens_pedido')
export class ItensPedidoEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Index()
  @Column({ type: 'bigint', name: 'pedido_id' })
  pedido_id: string;

  @Index()
  @Column({ type: 'bigint', name: 'produto_id' })
  produto_id: string;

  @Column({ type: 'bigint', name: 'variacao_id', nullable: true })
  variacao_id: string | null;

  @Column({ type: 'int' })
  quantidade: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'preco_unitario' })
  preco_unitario: string;

  @Column({ type: 'varchar', length: 255, name: 'nome_produto' })
  nome_produto: string;

  @Column({ type: 'text', name: 'variacao_descricao', nullable: true })
  variacao_descricao: string | null;
}
