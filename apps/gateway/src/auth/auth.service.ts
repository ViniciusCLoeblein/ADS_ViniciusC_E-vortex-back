import { Inject, Injectable } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_SERVICE_RMQ')
    private readonly clientRMQ: ClientRMQ,
  ) {}

  teste(): Observable<{ status: string }> {
    return this.clientRMQ.send({ cmd: 'Auth.Teste' }, {});
  }

  register(payload: RegisterDto): Observable<{
    userId: string;
    accessToken: string;
    accessTokenExpiresAt: string;
  }> {
    return this.clientRMQ.send({ cmd: 'Auth.Register' }, payload);
  }

  login(payload: LoginDto): Observable<{
    userId: string;
    accessToken: string;
    accessTokenExpiresAt: string;
  }> {
    return this.clientRMQ.send({ cmd: 'Auth.Login' }, payload);
  }
}
