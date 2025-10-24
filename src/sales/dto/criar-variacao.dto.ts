import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsInt,
  Min,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CriarVariacaoDto {
  @ApiProperty({
    description: 'ID do produto',
    example: '1',
  })
  @IsNotEmpty()
  @IsString()
  produtoId: string;

  @ApiProperty({
    description: 'Tipo da variação (cor, tamanho, capacidade, etc)',
    example: 'Tamanho',
    maxLength: 50,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  tipo: string;

  @ApiProperty({
    description: 'Valor da variação',
    example: 'G',
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  valor: string;

  @ApiProperty({
    description: 'SKU único da variação',
    example: 'PROD-001-G',
    minLength: 3,
    maxLength: 50,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  sku: string;

  @ApiPropertyOptional({
    description: 'Preço adicional ou desconto da variação',
    example: 10.0,
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  precoAdicional?: number;

  @ApiProperty({
    description: 'Quantidade em estoque da variação',
    example: 50,
    minimum: 0,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  estoque: number;

  @ApiPropertyOptional({
    description: 'Ordem de exibição da variação',
    example: 1,
    minimum: 0,
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  ordem?: number;
}
