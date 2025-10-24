import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AtualizarItemCarrinhoDto {
  @ApiProperty({ description: 'Quantidade', minimum: 1 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantidade: number;
}
