import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class AtualizarPushTokenDto {
  @ApiProperty({ description: 'Token de push notification' })
  @IsString()
  @IsNotEmpty()
  pushToken: string;
}
