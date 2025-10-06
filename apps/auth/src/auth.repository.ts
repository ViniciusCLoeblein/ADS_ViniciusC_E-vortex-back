import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthRepository {
  constructor() {}

  async teste(): Promise<any> {
    return { status: 'ok' };
  }
}
