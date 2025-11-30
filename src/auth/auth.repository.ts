import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuariosEntity } from '../entities/usuarios.entity';
import { VendedoresEntity } from '../entities/vendedores.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(UsuariosEntity)
    private readonly usuariosRepository: Repository<UsuariosEntity>,
    @InjectRepository(VendedoresEntity)
    private readonly vendedoresRepository: Repository<VendedoresEntity>,
  ) {}

  async teste(): Promise<{ status: string }> {
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

  async findVendedorByCnpj(cnpj: string): Promise<VendedoresEntity> {
    return this.vendedoresRepository.findOne({ where: { cnpj } });
  }

  async findVendedorByUsuarioId(usuarioId: string): Promise<VendedoresEntity> {
    return this.vendedoresRepository.findOne({
      where: { usuario_id: usuarioId },
    });
  }

  async createVendedor(
    vendedor: Partial<VendedoresEntity>,
  ): Promise<VendedoresEntity> {
    return this.vendedoresRepository.save(vendedor);
  }
}
