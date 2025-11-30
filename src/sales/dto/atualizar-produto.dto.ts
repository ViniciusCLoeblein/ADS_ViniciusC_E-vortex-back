import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class AtualizarProdutoDto {
  @ApiPropertyOptional({
    description: 'ID da categoria do produto',
    example: '1',
  })
  @IsOptional()
  @IsString()
  categoriaId?: string;

  @ApiPropertyOptional({
    description: 'SKU único do produto',
    example: 'PROD-001',
    minLength: 3,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  sku?: string;

  @ApiPropertyOptional({
    description: 'Nome do produto',
    example: 'Notebook Gamer',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  nome?: string;

  @ApiPropertyOptional({
    description: 'Descrição completa do produto',
    example: 'Notebook gamer de alta performance com processador Intel i7',
  })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiPropertyOptional({
    description: 'Descrição curta do produto',
    example: 'Notebook gamer Intel i7, 16GB RAM, RTX 3060',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  descricaoCurta?: string;

  @ApiPropertyOptional({
    description: 'Preço do produto',
    example: 4999.99,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  preco?: number;

  @ApiPropertyOptional({
    description: 'Preço promocional do produto',
    example: 4499.99,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  precoPromocional?: number;

  @ApiPropertyOptional({
    description: 'Peso do produto em kg',
    example: 2.5,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  pesoKg?: number;

  @ApiPropertyOptional({
    description: 'Altura do produto em cm',
    example: 30,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  alturaCm?: number;

  @ApiPropertyOptional({
    description: 'Largura do produto em cm',
    example: 40,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  larguraCm?: number;

  @ApiPropertyOptional({
    description: 'Profundidade do produto em cm',
    example: 5,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  profundidadeCm?: number;

  @ApiPropertyOptional({
    description: 'Quantidade em estoque',
    example: 100,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  estoque?: number;

  @ApiPropertyOptional({
    description: 'Estoque mínimo (alerta)',
    example: 10,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  estoqueMinimo?: number;

  @ApiPropertyOptional({
    description: 'Tags do produto separadas por vírgula',
    example: 'notebook,gamer,intel,rtx',
  })
  @IsOptional()
  @IsString()
  tags?: string;

  @ApiPropertyOptional({
    description: 'Produto em destaque',
    example: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  destaque?: boolean;

  @ApiPropertyOptional({
    description: 'Produto ativo',
    example: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  ativo?: boolean;
}
