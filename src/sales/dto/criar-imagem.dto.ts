import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsInt,
  Min,
  MaxLength,
  IsIn,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CriarImagemDto {
  @ApiProperty({
    description: 'ID do produto',
    example: '1',
  })
  @IsNotEmpty()
  @IsString()
  produtoId: string;

  @ApiProperty({
    description: 'Tipo da imagem',
    example: 'principal',
    enum: ['principal', 'galeria', 'miniatura'],
  })
  @IsNotEmpty()
  @IsString()
  @IsIn(['principal', 'galeria', 'miniatura'])
  tipo: string;

  @ApiPropertyOptional({
    description: 'Legenda ou descrição da imagem',
    example: 'Vista frontal do produto',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  legenda?: string;

  @ApiPropertyOptional({
    description: 'Ordem de exibição da imagem',
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
