import {
  IsOptional,
  IsString,
  IsInt,
  IsBoolean,
  Min,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class AtualizarCategoriaDto {
  @ApiPropertyOptional({
    description: 'Nome da categoria',
    example: 'Eletrônicos',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nome?: string;

  @ApiPropertyOptional({
    description: 'Descrição da categoria',
    example: 'Produtos eletrônicos em geral',
  })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiPropertyOptional({
    description: 'Slug único da categoria (URL amigável)',
    example: 'eletronicos',
    maxLength: 120,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug deve conter apenas letras minúsculas, números e hífens',
  })
  slug?: string;

  @ApiPropertyOptional({
    description: 'Ícone da categoria (classe CSS ou nome do ícone)',
    example: 'fa-laptop',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  icone?: string;

  @ApiPropertyOptional({
    description: 'Cor em hexadecimal para a categoria',
    example: '#3498db',
  })
  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'Cor deve estar no formato hexadecimal (#RRGGBB)',
  })
  corHex?: string;

  @ApiPropertyOptional({
    description: 'Ordem de exibição da categoria',
    example: 1,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  ordem?: number;

  @ApiPropertyOptional({
    description: 'ID da categoria pai (para subcategorias)',
    example: '1',
  })
  @IsOptional()
  @IsString()
  categoriaPaiId?: string;

  @ApiPropertyOptional({
    description: 'Status ativo/inativo da categoria',
    example: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  ativo?: boolean;
}
