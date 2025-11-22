import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsIn,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AtualizarStatusPedidoDto {
  @ApiProperty({
    description: 'Novo status do pedido',
    example: 'enviado',
    enum: ['enviado', 'entregue', 'cancelado'],
  })
  @IsNotEmpty()
  @IsString()
  @IsIn(['enviado', 'entregue', 'cancelado'])
  status: string;

  @ApiPropertyOptional({
    description:
      'Código de rastreamento (obrigatório quando status for "enviado")',
    example: 'BR123456789BR',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  codigoRastreamento?: string;

  @ApiPropertyOptional({
    description: 'Transportadora (obrigatório quando status for "enviado")',
    example: 'Correios',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  transportadora?: string;

  @ApiPropertyOptional({
    description: 'Previsão de entrega (formato: YYYY-MM-DD)',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsString()
  previsaoEntrega?: string;

  @ApiPropertyOptional({
    description:
      'Motivo do cancelamento (obrigatório quando status for "cancelado")',
    example: 'Produto fora de estoque',
  })
  @IsOptional()
  @IsString()
  motivoCancelamento?: string;
}
