import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: 'Nome do usuário' })
  @IsNotEmpty()
  @IsString()
  @Length(2, 100)
  nome: string;

  @ApiProperty({ description: 'Email do usuário' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Senha do usuário' })
  @IsNotEmpty()
  @IsString()
  @Length(6, 255)
  senha: string;

  @ApiProperty({ description: 'CPF do usuário' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{11}$/)
  cpf: string;

  @ApiProperty({ description: 'Tipo do usuário' })
  @IsString()
  @IsOptional()
  tipo?: string;

  @IsString()
  @IsOptional()
  telefone?: string;

  @ApiProperty({ description: 'Data de nascimento do usuário' })
  @IsDateString()
  @IsOptional()
  dataNascimento?: string;

  @ApiProperty({ description: 'Aceita marketing do usuário' })
  @IsBoolean()
  @IsOptional()
  aceitaMarketing?: boolean;
}
