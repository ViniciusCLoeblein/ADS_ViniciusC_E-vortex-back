import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsDateString,
  Length,
  Min,
} from 'class-validator';

export class AtualizarCupomDto {
  @ApiProperty({ description: 'Código do cupom', required: false })
  @IsString()
  @Length(3, 50)
  @IsOptional()
  codigo?: string;

  @ApiProperty({ description: 'Descrição do cupom', required: false })
  @IsString()
  @Length(1, 255)
  @IsOptional()
  descricao?: string;

  @ApiProperty({
    description: 'Tipo do cupom (percentual ou fixo)',
    required: false,
  })
  @IsString()
  @Length(1, 20)
  @IsOptional()
  tipo?: string;

  @ApiProperty({ description: 'Valor do desconto', required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  valor?: number;

  @ApiProperty({
    description: 'Valor mínimo do pedido para usar o cupom',
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  valorMinimo?: number;

  @ApiProperty({ description: 'Número máximo de usos', required: false })
  @IsNumber()
  @Min(1)
  @IsOptional()
  usosMaximos?: number;

  @ApiProperty({
    description: 'ID do usuário (para cupons pessoais)',
    required: false,
  })
  @IsString()
  @IsOptional()
  usuarioId?: string;

  @ApiProperty({ description: 'Data de início da validade', required: false })
  @IsDateString()
  @IsOptional()
  dataInicio?: string;

  @ApiProperty({ description: 'Data de expiração', required: false })
  @IsDateString()
  @IsOptional()
  dataExpiracao?: string;

  @ApiProperty({ description: 'Se o cupom está ativo', required: false })
  @IsBoolean()
  @IsOptional()
  ativo?: boolean;
}
