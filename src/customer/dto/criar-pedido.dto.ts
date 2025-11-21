import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class ItemCriarPedidoDto {
  @ApiProperty({ description: 'ID do produto' })
  @IsNotEmpty()
  @IsString()
  produtoId: string;

  @ApiPropertyOptional({ description: 'ID da variação (opcional)' })
  @IsOptional()
  @IsString()
  variacaoId?: string;

  @ApiProperty({ description: 'Quantidade', example: 1, minimum: 1 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  quantidade: number;
}

export class CriarPedidoDto {
  @ApiProperty({ description: 'Endereço de entrega do usuário' })
  @IsNotEmpty()
  @IsString()
  enderecoEntregaId: string;

  @ApiPropertyOptional({
    description: 'Cartão de crédito do usuário (quando método for cartão)',
  })
  @IsOptional()
  @IsString()
  cartaoCreditoId?: string;

  @ApiProperty({
    description: 'Método de pagamento (ex.: cartao, pix, boleto)',
    example: 'cartao',
    maxLength: 20,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  metodoPagamento: string;

  @ApiProperty({ description: 'Valor do frete', example: 19.9 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  frete: number;

  @ApiPropertyOptional({ description: 'Desconto aplicado', example: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  desconto?: number;

  @ApiProperty({ type: [ItemCriarPedidoDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemCriarPedidoDto)
  itens: ItemCriarPedidoDto[];
}
