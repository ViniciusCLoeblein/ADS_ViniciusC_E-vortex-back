import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import moment from 'moment';
import * as bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthTokenResponse, TestResponse } from './types/auth.types';
import { UsuariosEntity } from 'apps/entities/usuarios.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async teste(): Promise<TestResponse> {
    return this.authRepository.teste();
  }

  async createToken(userId: string): Promise<AuthTokenResponse> {
    const timeToken = process.env.JWT_EXPIRES_IN;
    const accessToken = this.jwtService.sign({
      sub: userId,
    });

    return {
      accessToken,
      accessTokenExpiresAt: moment()
        .add(timeToken[0], timeToken[1] as 'd' | 'h')
        .format(),
      userId,
    };
  }

  async register(payload: RegisterDto): Promise<AuthTokenResponse> {
    const {
      nome,
      email,
      senha,
      cpf,
      tipo = 'usuario',
      telefone,
      dataNascimento,
    } = payload || ({} as RegisterDto);
    if (!nome || !email || !senha || !cpf) {
      throw new BadRequestException(
        'Campos obrigatórios: nome, email, senha, cpf',
      );
    }

    const existingByEmail = await this.authRepository.findUserByEmail(email);
    if (existingByEmail) {
      throw new BadRequestException('Email já cadastrado');
    }
    const existingByCpf = await this.authRepository.findUserByCpf(cpf);
    if (existingByCpf) {
      throw new BadRequestException('CPF já cadastrado');
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const userToCreate: Partial<UsuariosEntity> = {
      uuid: randomUUID(),
      nome,
      email,
      senhaHash,
      cpf,
      tipo,
      telefone: telefone ?? null,
      avatarUrl: null,
      dataNascimento: dataNascimento ?? null,
      aceitaMarketing: false,
      emailVerificado: false,
      ultimoLogin: null,
    };

    const created = await this.authRepository.createUser(userToCreate);
    const token = await this.createToken(created.id);
    return token;
  }

  async login(payload: LoginDto): Promise<AuthTokenResponse> {
    const { email, senha } = payload || ({} as LoginDto);
    if (!email || !senha) {
      throw new BadRequestException('Campos obrigatórios: email, senha');
    }
    const user = await this.authRepository.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    const ok = await bcrypt.compare(senha, user.senhaHash);
    if (!ok) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    const token = await this.createToken(user.id);
    return token;
  }
}
