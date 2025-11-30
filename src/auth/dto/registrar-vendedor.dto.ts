import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegistrarVendedorDto {
  @ApiProperty({
    description: 'Nome completo do vendedor',
    example: 'João Silva',
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  nome: string;

  @ApiProperty({
    description: 'Email do vendedor',
    example: 'joao.silva@empresa.com',
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({
    description: 'Senha do vendedor',
    example: 'Senha@123',
    minLength: 6,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  senha: string;

  @ApiPropertyOptional({
    description: 'Telefone do vendedor',
    example: '51999999999',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefone?: string;

  @ApiProperty({
    description: 'CNPJ da empresa (apenas números)',
    example: '12345678000190',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{14}$/, {
    message: 'CNPJ deve conter 14 dígitos',
  })
  cnpj: string;

  @ApiProperty({
    description: 'Razão social da empresa',
    example: 'João Silva LTDA',
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  razaoSocial: string;

  @ApiProperty({
    description: 'Nome fantasia da empresa',
    example: 'Silva Store',
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  nomeFantasia: string;

  @ApiProperty({
    description: 'Inscrição estadual',
    example: '123456789',
    maxLength: 20,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  inscricaoEstadual: string;

  @ApiPropertyOptional({
    description: 'Dados da conta bancária (JSON)',
    example: { banco: '001', agencia: '1234', conta: '12345-6' },
  })
  @IsOptional()
  contaBancaria?: Record<string, unknown>;
}
