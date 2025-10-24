import {
  IsOptional,
  IsString,
  IsNumber,
  IsInt,
  Min,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class AtualizarVariacaoDto {
  @ApiPropertyOptional({
    description: 'Tipo da variação (cor, tamanho, capacidade, etc)',
    example: 'Tamanho',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  tipo?: string;

  @ApiPropertyOptional({
    description: 'Valor da variação',
    example: 'G',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  valor?: string;

  @ApiPropertyOptional({
    description: 'SKU único da variação',
    example: 'PROD-001-G',
    minLength: 3,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  sku?: string;

  @ApiPropertyOptional({
    description: 'Preço adicional ou desconto da variação',
    example: 10.0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  precoAdicional?: number;

  @ApiPropertyOptional({
    description: 'Quantidade em estoque da variação',
    example: 50,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  estoque?: number;

  @ApiPropertyOptional({
    description: 'Ordem de exibição da variação',
    example: 1,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  ordem?: number;
}
