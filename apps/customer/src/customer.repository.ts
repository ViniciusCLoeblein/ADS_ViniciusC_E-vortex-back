import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EnderecosEntity } from 'apps/entities/enderecos.entity';
import { CartoesCreditoEntity } from 'apps/entities/cartoes_credito.entity';
import { NotificacoesEntity } from 'apps/entities/notificacoes.entity';
import { PedidosEntity } from 'apps/entities/pedidos.entity';
import { ItensPedidoEntity } from 'apps/entities/itens_pedido.entity';
import { UsuariosEntity } from 'apps/entities/usuarios.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CustomerRepository {
  constructor(
    @InjectRepository(EnderecosEntity)
    private enderecosRepository: Repository<EnderecosEntity>,
    @InjectRepository(CartoesCreditoEntity)
    private cartoesRepository: Repository<CartoesCreditoEntity>,
    @InjectRepository(NotificacoesEntity)
    private notificacoesRepository: Repository<NotificacoesEntity>,
    @InjectRepository(PedidosEntity)
    private pedidosRepository: Repository<PedidosEntity>,
    @InjectRepository(ItensPedidoEntity)
    private itensPedidoRepository: Repository<ItensPedidoEntity>,
    @InjectRepository(UsuariosEntity)
    private usuariosRepository: Repository<UsuariosEntity>,
  ) {}

  async createEndereco(
    endereco: Partial<EnderecosEntity>,
  ): Promise<EnderecosEntity> {
    return this.enderecosRepository.save(endereco);
  }

  async findEnderecosByUsuario(usuarioId: string): Promise<EnderecosEntity[]> {
    return this.enderecosRepository.find({
      where: { usuario_id: usuarioId },
      order: { principal: 'DESC', criado_em: 'DESC' },
    });
  }

  async findEnderecoById(id: string): Promise<EnderecosEntity | null> {
    return this.enderecosRepository.findOne({ where: { id } });
  }

  async updateEndereco(
    id: string,
    data: Partial<EnderecosEntity>,
  ): Promise<void> {
    await this.enderecosRepository.update(id, data);
  }

  async deleteEndereco(id: string): Promise<void> {
    await this.enderecosRepository.delete(id);
  }

  async setPrincipalEndereco(usuarioId: string): Promise<void> {
    await this.enderecosRepository.update(
      { usuario_id: usuarioId },
      { principal: false },
    );
  }

  async createCartao(
    cartao: Partial<CartoesCreditoEntity>,
  ): Promise<CartoesCreditoEntity> {
    return this.cartoesRepository.save(cartao);
  }

  async findCartoesByUsuario(
    usuarioId: string,
  ): Promise<CartoesCreditoEntity[]> {
    return this.cartoesRepository.find({
      where: { usuario_id: usuarioId, ativo: true },
      order: { principal: 'DESC', criado_em: 'DESC' },
    });
  }

  async findCartaoById(id: string): Promise<CartoesCreditoEntity | null> {
    return this.cartoesRepository.findOne({ where: { id } });
  }

  async deleteCartao(id: string): Promise<void> {
    await this.cartoesRepository.update(id, { ativo: false });
  }

  async setPrincipalCartao(usuarioId: string): Promise<void> {
    await this.cartoesRepository.update(
      { usuario_id: usuarioId },
      { principal: false },
    );
  }

  async findNotificacoesByUsuario(
    usuarioId: string,
  ): Promise<NotificacoesEntity[]> {
    return this.notificacoesRepository.find({
      where: { usuario_id: usuarioId },
      order: { enviada_em: 'DESC' },
      take: 50,
    });
  }

  async findNotificacaoById(id: string): Promise<NotificacoesEntity | null> {
    return this.notificacoesRepository.findOne({ where: { id } });
  }

  async updateNotificacao(
    id: string,
    data: Partial<NotificacoesEntity>,
  ): Promise<void> {
    await this.notificacoesRepository.update(id, data);
  }

  async findPedidosByUsuario(usuarioId: string): Promise<PedidosEntity[]> {
    return this.pedidosRepository.find({
      where: { usuario_id: usuarioId },
      order: { criado_em: 'DESC' },
    });
  }

  async findPedidoById(id: string): Promise<PedidosEntity | null> {
    return this.pedidosRepository.findOne({ where: { id } });
  }

  async findItensPedido(pedidoId: string): Promise<ItensPedidoEntity[]> {
    return this.itensPedidoRepository.find({
      where: { pedido_id: pedidoId },
    });
  }

  async findUsuarioById(id: string): Promise<UsuariosEntity | null> {
    return this.usuariosRepository.findOne({ where: { id } });
  }

  async updateUsuario(
    id: string,
    data: Partial<UsuariosEntity>,
  ): Promise<void> {
    await this.usuariosRepository.update(id, data);
  }
}
