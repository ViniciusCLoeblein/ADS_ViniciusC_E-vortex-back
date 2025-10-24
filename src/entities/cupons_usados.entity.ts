import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
} from 'typeorm';

@Entity('cupons_usados')
export class CuponsUsadosEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Index()
  @Column({ type: 'bigint', name: 'cupom_id' })
  cupom_id: string;

  @Index()
  @Column({ type: 'bigint', name: 'usuario_id' })
  usuario_id: string;

  @Index()
  @Column({ type: 'bigint', name: 'pedido_id' })
  pedido_id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'valor_desconto' })
  valor_desconto: string;

  @CreateDateColumn({ type: 'timestamp', name: 'usado_em' })
  usado_em: Date;
}
