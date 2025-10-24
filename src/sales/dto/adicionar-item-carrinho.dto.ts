import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AdicionarItemCarrinhoDto {
  @ApiProperty({ description: 'ID do produto' })
  @IsNotEmpty()
  @IsString()
  produtoId: string;

  @ApiPropertyOptional({ description: 'ID da variação do produto' })
  @IsOptional()
  @IsString()
  variacaoId?: string;

  @ApiProperty({ description: 'Quantidade', minimum: 1 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantidade: number;
}
