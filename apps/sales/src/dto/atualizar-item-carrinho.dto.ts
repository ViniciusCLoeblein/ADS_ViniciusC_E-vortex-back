import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  Min,
} from 'class-validator';

export class AtualizarItemCarrinhoDto {
  @IsOptional()
  @IsString()
  usuarioId?: string;

  @IsOptional()
  @IsString()
  sessaoId?: string;

  @IsNotEmpty()
  @IsString()
  itemId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantidade: number;
}
