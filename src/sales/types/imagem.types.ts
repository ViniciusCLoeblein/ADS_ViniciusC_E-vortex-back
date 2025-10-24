import { ApiProperty } from '@nestjs/swagger';

export class ImagemRes {
  @ApiProperty()
  id: string;

  @ApiProperty()
  produto_id: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  tipo: string;

  @ApiProperty()
  ordem: number;

  @ApiProperty({ nullable: true })
  legenda: string | null;

  @ApiProperty()
  criado_em: Date;
}

export class ImagemUploadRes {
  @ApiProperty()
  id: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  message: string;
}

export class ListaImagensRes {
  @ApiProperty({ type: [ImagemRes] })
  imagens: ImagemRes[];

  @ApiProperty()
  total: number;
}
