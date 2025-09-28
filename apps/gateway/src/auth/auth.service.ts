import { Inject, Injectable } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_SERVICE_RMQ')
    private readonly clientRMQ: ClientRMQ,
  ) {}

  teste(): Observable<any> {
    return this.clientRMQ.send({ cmd: 'Auth.Teste' }, {});
  }
}
