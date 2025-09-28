import { Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import moment from 'moment';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async teste(): Promise<any> {
    return this.authRepository.teste();
  }

  async createToken(userId: string) {
    const timeToken = process.env.JWT_EXPIRES_IN;
    const accessToken = this.jwtService.sign({
      sub: userId,
    });

    return {
      accessToken,
      accessTokenExpiresAt: moment()
        .add(timeToken[0], timeToken[1] as 'd' | 'h')
        .format(),
    };
  }
}
