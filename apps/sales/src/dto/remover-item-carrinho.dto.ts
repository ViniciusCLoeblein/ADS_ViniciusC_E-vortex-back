import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RemoverItemCarrinhoDto {
  @IsOptional()
  @IsString()
  usuarioId?: string;

  @IsOptional()
  @IsString()
  sessaoId?: string;

  @IsNotEmpty()
  @IsString()
  itemId: string;
}
