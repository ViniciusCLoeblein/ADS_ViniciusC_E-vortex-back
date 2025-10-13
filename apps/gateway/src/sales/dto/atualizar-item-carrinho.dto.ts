import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AtualizarItemCarrinhoDto {
  @ApiPropertyOptional({
    description: 'ID da sessão (para usuários não autenticados)',
  })
  @IsOptional()
  @IsString()
  sessaoId?: string;

  @ApiProperty({ description: 'Quantidade', minimum: 1 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantidade: number;
}
