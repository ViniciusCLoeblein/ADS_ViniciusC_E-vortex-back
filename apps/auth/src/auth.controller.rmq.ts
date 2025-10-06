import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthControllerRMQ {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'Auth.Teste' })
  teste(): Promise<any> {
    return this.authService.teste();
  }
}
