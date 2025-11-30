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

export class CriarCupomDto {
  @ApiProperty({ description: 'Código do cupom' })
  @IsString()
  @Length(3, 50)
  codigo: string;

  @ApiProperty({ description: 'Descrição do cupom' })
  @IsString()
  @Length(1, 255)
  descricao: string;

  @ApiProperty({ description: 'Tipo do cupom (percentual ou fixo)' })
  @IsString()
  @Length(1, 20)
  tipo: string;

  @ApiProperty({ description: 'Valor do desconto' })
  @IsNumber()
  @Min(0)
  valor: number;

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

  @ApiProperty({ description: 'Se o cupom está ativo', default: true })
  @IsBoolean()
  @IsOptional()
  ativo?: boolean;
}
