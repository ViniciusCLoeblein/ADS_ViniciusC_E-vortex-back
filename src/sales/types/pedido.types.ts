import { ApiProperty } from '@nestjs/swagger';

export class PedidoStatusAtualizadoRes {
  @ApiProperty({ description: 'ID do pedido', example: '1' })
  id: string;

  @ApiProperty({
    description: 'UUID do pedido',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  uuid: string;

  @ApiProperty({
    description: 'Status atual do pedido',
    example: 'enviado',
  })
  status: string;

  @ApiProperty({
    description: 'Código de rastreamento',
    example: 'BR123456789BR',
    nullable: true,
  })
  codigoRastreamento: string | null;

  @ApiProperty({
    description: 'Transportadora',
    example: 'Correios',
    nullable: true,
  })
  transportadora: string | null;

  @ApiProperty({
    description: 'Previsão de entrega',
    example: '2024-12-31',
    nullable: true,
  })
  previsaoEntrega: string | Date | null;

  @ApiProperty({
    description: 'Data de pagamento',
    nullable: true,
  })
  dataPagamento: Date | null;

  @ApiProperty({
    description: 'Data de envio',
    nullable: true,
  })
  dataEnvio: Date | null;

  @ApiProperty({
    description: 'Data de entrega',
    nullable: true,
  })
  dataEntrega: Date | null;

  @ApiProperty({
    description: 'Data de cancelamento',
    nullable: true,
  })
  dataCancelamento: Date | null;

  @ApiProperty({
    description: 'Motivo do cancelamento',
    nullable: true,
  })
  motivoCancelamento: string | null;

  @ApiProperty({
    description: 'Data de atualização',
  })
  atualizadoEm: Date;
}
