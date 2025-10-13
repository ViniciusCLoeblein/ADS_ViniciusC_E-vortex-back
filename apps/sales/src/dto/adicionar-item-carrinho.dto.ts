import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  Min,
} from 'class-validator';

export class AdicionarItemCarrinhoDto {
  @IsOptional()
  @IsString()
  usuarioId?: string;

  @IsOptional()
  @IsString()
  sessaoId?: string;

  @IsNotEmpty()
  @IsString()
  produtoId: string;

  @IsOptional()
  @IsString()
  variacaoId?: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantidade: number;
}
