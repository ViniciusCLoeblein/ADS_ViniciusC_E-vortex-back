import {
  IsOptional,
  IsString,
  IsBoolean,
  MaxLength,
  Matches,
  Length,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class AtualizarEnderecoDto {
  @ApiPropertyOptional({
    description: 'Apelido do endereço',
    example: 'Casa',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  apelido?: string;

  @ApiPropertyOptional({
    description: 'CEP (apenas números)',
    example: '90000000',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{8}$/, { message: 'CEP deve conter 8 dígitos' })
  cep?: string;

  @ApiPropertyOptional({
    description: 'Logradouro',
    example: 'Rua das Flores',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  logradouro?: string;

  @ApiPropertyOptional({
    description: 'Número',
    example: '123',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  numero?: string;

  @ApiPropertyOptional({
    description: 'Complemento',
    example: 'Apto 101',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  complemento?: string;

  @ApiPropertyOptional({
    description: 'Bairro',
    example: 'Centro',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  bairro?: string;

  @ApiPropertyOptional({
    description: 'Cidade',
    example: 'Porto Alegre',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  cidade?: string;

  @ApiPropertyOptional({
    description: 'Estado (UF)',
    example: 'RS',
  })
  @IsOptional()
  @IsString()
  @Length(2, 2)
  estado?: string;

  @ApiPropertyOptional({
    description: 'País (código)',
    example: 'BR',
  })
  @IsOptional()
  @IsString()
  @Length(2, 2)
  pais?: string;

  @ApiPropertyOptional({
    description: 'Definir como endereço principal',
    example: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  principal?: boolean;
}

