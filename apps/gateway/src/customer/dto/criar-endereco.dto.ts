import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  MaxLength,
  Matches,
  Length,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CriarEnderecoDto {
  @ApiProperty({
    description: 'Apelido do endereço',
    example: 'Casa',
    maxLength: 50,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  apelido: string;

  @ApiProperty({
    description: 'CEP (apenas números)',
    example: '90000000',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{8}$/, { message: 'CEP deve conter 8 dígitos' })
  cep: string;

  @ApiProperty({
    description: 'Logradouro',
    example: 'Rua das Flores',
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  logradouro: string;

  @ApiProperty({
    description: 'Número',
    example: '123',
    maxLength: 20,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  numero: string;

  @ApiPropertyOptional({
    description: 'Complemento',
    example: 'Apto 101',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  complemento?: string;

  @ApiProperty({
    description: 'Bairro',
    example: 'Centro',
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  bairro: string;

  @ApiProperty({
    description: 'Cidade',
    example: 'Porto Alegre',
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  cidade: string;

  @ApiProperty({
    description: 'Estado (UF)',
    example: 'RS',
  })
  @IsNotEmpty()
  @IsString()
  @Length(2, 2)
  estado: string;

  @ApiProperty({
    description: 'País (código)',
    example: 'BR',
  })
  @IsNotEmpty()
  @IsString()
  @Length(2, 2)
  pais: string;

  @ApiPropertyOptional({
    description: 'Definir como endereço principal',
    example: true,
    default: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  principal?: boolean;
}

