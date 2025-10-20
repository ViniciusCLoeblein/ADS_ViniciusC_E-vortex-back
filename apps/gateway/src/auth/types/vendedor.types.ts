import { ApiProperty } from '@nestjs/swagger';

export class VendedorRegistradoRes {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  vendedorId: string;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  accessTokenExpiresAt: string;

  @ApiProperty()
  status: string;
}
