import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsOptional,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CriarAvaliacaoDto {
  @ApiProperty({
    description: 'ID do pedido',
    example: '1',
  })
  @IsNotEmpty()
  @IsString()
  pedidoId: string;

  @ApiProperty({
    description: 'ID do produto',
    example: '1',
  })
  @IsNotEmpty()
  @IsString()
  produtoId: string;

  @ApiProperty({
    description: 'Nota da avaliação (1 a 5)',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  nota: number;

  @ApiPropertyOptional({
    description: 'Título da avaliação',
    example: 'Excelente produto!',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  titulo?: string;

  @ApiPropertyOptional({
    description: 'Comentário da avaliação',
    example: 'Produto chegou rápido e em perfeito estado. Recomendo!',
  })
  @IsOptional()
  @IsString()
  comentario?: string;
}
