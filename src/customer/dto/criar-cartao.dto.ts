import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsOptional,
  IsBoolean,
  MaxLength,
  Min,
  Max,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CriarCartaoDto {
  @ApiProperty({
    description: 'Nome do titular do cartão',
    example: 'João Silva',
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  titular: string;

  @ApiProperty({
    description: 'Número do cartão (apenas números)',
    example: '4111111111111111',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{13,19}$/, {
    message: 'Número do cartão deve conter 13 a 19 dígitos',
  })
  numero: string;

  @ApiProperty({
    description: 'Bandeira do cartão',
    example: 'Visa',
    maxLength: 20,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  bandeira: string;

  @ApiProperty({
    description: 'Mês de validade (1-12)',
    example: 12,
    minimum: 1,
    maximum: 12,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  mesValidade: number;

  @ApiProperty({
    description: 'Ano de validade (YYYY)',
    example: 2026,
    minimum: 2024,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(2024)
  anoValidade: number;

  @ApiProperty({
    description: 'CVV do cartão',
    example: '123',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{3,4}$/, { message: 'CVV deve conter 3 ou 4 dígitos' })
  cvv: string;

  @ApiPropertyOptional({
    description: 'Definir como cartão principal',
    example: true,
    default: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  principal?: boolean;
}
