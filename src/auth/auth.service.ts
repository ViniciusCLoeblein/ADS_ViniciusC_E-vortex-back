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
import { UsuariosEntity } from '../entities/usuarios.entity';
import { VendedoresEntity } from '../entities/vendedores.entity';

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
      aceitaMarketing = false,
    } = payload;
    const [existingByEmail, existingByCpf] = await Promise.all([
      this.authRepository.findUserByEmail(email),
      this.authRepository.findUserByCpf(cpf),
    ]);
    if (existingByEmail || existingByCpf) {
      throw new BadRequestException(
        existingByEmail ? 'Email já cadastrado' : 'CPF já cadastrado',
      );
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
      aceitaMarketing,
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

  async registerVendedor(payload: {
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
    const {
      nome,
      email,
      senha,
      cpf,
      telefone,
      cnpj,
      razaoSocial,
      nomeFantasia,
      inscricaoEstadual,
      contaBancaria,
    } = payload;

    const [existingByEmail, existingByCpf] = await Promise.all([
      this.authRepository.findUserByEmail(email),
      this.authRepository.findUserByCpf(cpf),
    ]);

    if (existingByEmail || existingByCpf) {
      throw new BadRequestException(
        existingByEmail ? 'Email já cadastrado' : 'CPF já cadastrado',
      );
    }

    const existingByCnpj = await this.authRepository.findVendedorByCnpj(cnpj);
    if (existingByCnpj) {
      throw new BadRequestException('CNPJ já cadastrado');
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const userToCreate: Partial<UsuariosEntity> = {
      uuid: randomUUID(),
      nome,
      email,
      senhaHash,
      cpf,
      tipo: 'vendedor',
      telefone: telefone ?? null,
      avatarUrl: null,
      dataNascimento: null,
      aceitaMarketing: false,
      emailVerificado: false,
      ultimoLogin: null,
    };

    const usuario = await this.authRepository.createUser(userToCreate);
    const vendedorToCreate: Partial<VendedoresEntity> = {
      usuario_id: usuario.id,
      uuid: randomUUID(),
      cnpj,
      razao_social: razaoSocial,
      nome_fantasia: nomeFantasia,
      inscricao_estadual: inscricaoEstadual,
      conta_bancaria: contaBancaria || null,
      comissao_percentual: '5.00',
      status: 'pendente',
      motivo_rejeicao: null,
      data_aprovacao: null,
      termos_versao: null,
      termos_aceito_em: null,
    };

    const vendedor = await this.authRepository.createVendedor(vendedorToCreate);
    const token = await this.createToken(usuario.id);

    return {
      ...token,
      vendedorId: vendedor.id,
      status: vendedor.status,
    };
  }
}
