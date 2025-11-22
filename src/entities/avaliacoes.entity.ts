import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('avaliacoes')
export class AvaliacoesEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @ApiProperty()
  @Index()
  @Column({ type: 'bigint', name: 'pedido_id' })
  pedido_id: string;

  @ApiProperty()
  @Index()
  @Column({ type: 'bigint', name: 'produto_id' })
  produto_id: string;

  @ApiProperty()
  @Index()
  @Column({ type: 'bigint', name: 'usuario_id' })
  usuario_id: string;

  @ApiProperty()
  @Index()
  @Column({ type: 'int' })
  nota: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255, nullable: true })
  titulo: string | null;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  comentario: string | null;

  @ApiProperty()
  @Index()
  @Column({ type: 'boolean', nullable: true })
  aprovada: boolean | null;

  @ApiProperty()
  @Column({ type: 'text', name: 'resposta_vendedor', nullable: true })
  resposta_vendedor: string | null;

  @ApiProperty()
  @Column({ type: 'timestamp', name: 'data_resposta', nullable: true })
  data_resposta: Date | null;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamp', name: 'criado_em' })
  criado_em: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: 'timestamp', name: 'atualizado_em' })
  atualizado_em: Date;
}
