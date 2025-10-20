import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthTokenResponse, TestResponse } from './types/auth.types';
import { IExceptionFilter } from 'apps/generics/filters/IExceptionFilterGrpc';

@Controller()
@UseFilters(IExceptionFilter)
export class AuthControllerRMQ {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'Auth.Teste' })
  teste(): Promise<TestResponse> {
    return this.authService.teste();
  }

  @MessagePattern({ cmd: 'Auth.Register' })
  register(payload: RegisterDto): Promise<AuthTokenResponse> {
    return this.authService.register(payload);
  }

  @MessagePattern({ cmd: 'Auth.Login' })
  login(payload: LoginDto): Promise<AuthTokenResponse> {
    return this.authService.login(payload);
  }

  @MessagePattern({ cmd: 'Auth.RegisterVendedor' })
  registerVendedor(payload: {
    nome: string;
    email: string;
    senha: string;
    cpf: string;
    telefone?: string;
    cnpj: string;
    razaoSocial: string;
    nomeFantasia: string;
    inscricaoEstadual: string;
    contaBancaria?: Record<string, unknown>;
  }): Promise<{
    userId: string;
    vendedorId: string;
    accessToken: string;
    accessTokenExpiresAt: string;
    status: string;
  }> {
    return this.authService.registerVendedor(payload);
  }
}
