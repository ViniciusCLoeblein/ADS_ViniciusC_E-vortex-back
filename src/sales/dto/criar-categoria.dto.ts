import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsInt,
  Min,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CriarCategoriaDto {
  @ApiProperty({
    description: 'Nome da categoria',
    example: 'Eletrônicos',
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  nome: string;

  @ApiProperty({
    description: 'Descrição da categoria',
    example: 'Produtos eletrônicos em geral',
  })
  @IsNotEmpty()
  @IsString()
  descricao: string;

  @ApiProperty({
    description: 'Slug único da categoria (URL amigável)',
    example: 'eletronicos',
    maxLength: 120,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug deve conter apenas letras minúsculas, números e hífens',
  })
  slug: string;

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
    default: 0,
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
}
