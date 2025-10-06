import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuariosEntity } from 'apps/entities/usuarios.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(UsuariosEntity)
    private usuariosRepository: Repository<UsuariosEntity>,
  ) {}

  async teste(): Promise<any> {
    return { status: 'ok' };
  }

  async findUserById(id: string): Promise<UsuariosEntity> {
    return this.usuariosRepository.findOne({ where: { id } });
  }

  async createUser(user: Partial<UsuariosEntity>): Promise<UsuariosEntity> {
    return this.usuariosRepository.save(user);
  }

  async findUserByEmail(email: string): Promise<UsuariosEntity> {
    return this.usuariosRepository.findOne({ where: { email } });
  }

  async findUserByCpf(cpf: string): Promise<UsuariosEntity> {
    return this.usuariosRepository.findOne({ where: { cpf } });
  }
}
