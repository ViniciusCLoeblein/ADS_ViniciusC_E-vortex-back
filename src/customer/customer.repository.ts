import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EnderecosEntity } from '../entities/enderecos.entity';
import { CartoesCreditoEntity } from '../entities/cartoes_credito.entity';
import { NotificacoesEntity } from '../entities/notificacoes.entity';
import { PedidosEntity } from '../entities/pedidos.entity';
import { ItensPedidoEntity } from '../entities/itens_pedido.entity';
import { ProdutosEntity } from '../entities/produtos.entity';
import { VariacoesProdutoEntity } from '../entities/variacoes_produto.entity';
import { UsuariosEntity } from '../entities/usuarios.entity';
import { VendedoresEntity } from '../entities/vendedores.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CustomerRepository {
  constructor(
    @InjectRepository(EnderecosEntity)
    private readonly enderecosRepository: Repository<EnderecosEntity>,
    @InjectRepository(CartoesCreditoEntity)
    private readonly cartoesRepository: Repository<CartoesCreditoEntity>,
    @InjectRepository(NotificacoesEntity)
    private readonly notificacoesRepository: Repository<NotificacoesEntity>,
    @InjectRepository(PedidosEntity)
    private readonly pedidosRepository: Repository<PedidosEntity>,
    @InjectRepository(ItensPedidoEntity)
    private readonly itensPedidoRepository: Repository<ItensPedidoEntity>,
    @InjectRepository(UsuariosEntity)
    private readonly usuariosRepository: Repository<UsuariosEntity>,
    @InjectRepository(ProdutosEntity)
    private readonly produtosRepository: Repository<ProdutosEntity>,
    @InjectRepository(VariacoesProdutoEntity)
    private readonly variacoesRepository: Repository<VariacoesProdutoEntity>,
    @InjectRepository(VendedoresEntity)
    private readonly vendedoresRepository: Repository<VendedoresEntity>,
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

  async findVendedorByUsuarioId(
    usuarioId: string,
  ): Promise<VendedoresEntity | null> {
    return this.vendedoresRepository.findOne({
      where: { usuario_id: usuarioId },
    });
  }

  async findVendedorById(id: string): Promise<VendedoresEntity | null> {
    return this.vendedoresRepository.findOne({ where: { id } });
  }

  async findEnderecosByVendedorId(
    vendedorId: string,
  ): Promise<EnderecosEntity[]> {
    const vendedor = await this.findVendedorById(vendedorId);
    if (!vendedor) {
      return [];
    }
    return this.findEnderecosByUsuario(vendedor.usuario_id);
  }

  async findPedidosByVendedor(vendedorId: string): Promise<PedidosEntity[]> {
    return this.pedidosRepository
      .createQueryBuilder('pedido')
      .innerJoin('itens_pedido', 'item', 'item.pedido_id = pedido.id')
      .innerJoin('produtos', 'produto', 'produto.id = item.produto_id')
      .where('produto.vendedor_id = :vendedorId', { vendedorId })
      .groupBy('pedido.id')
      .orderBy('pedido.criado_em', 'DESC')
      .getMany();
  }

  async findPedidoById(id: string): Promise<PedidosEntity | null> {
    return this.pedidosRepository.findOne({ where: { id } });
  }

  async findItensPedido(pedidoId: string): Promise<ItensPedidoEntity[]> {
    return this.itensPedidoRepository.find({
      where: { pedido_id: pedidoId },
    });
  }

  async findItensPedidoByVendedor(
    pedidoId: string,
    vendedorId: string,
  ): Promise<ItensPedidoEntity[]> {
    // Busca apenas os itens do pedido que pertencem aos produtos deste vendedor
    return this.itensPedidoRepository
      .createQueryBuilder('item')
      .innerJoin('produtos', 'produto', 'produto.id = item.produto_id')
      .where('item.pedido_id = :pedidoId', { pedidoId })
      .andWhere('produto.vendedor_id = :vendedorId', { vendedorId })
      .getMany();
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

  async createPedido(pedido: Partial<PedidosEntity>): Promise<PedidosEntity> {
    return this.pedidosRepository.save(pedido);
  }

  async createItensPedido(
    itens: Partial<ItensPedidoEntity>[],
  ): Promise<ItensPedidoEntity[]> {
    return this.itensPedidoRepository.save(itens);
  }

  async findProdutoById(id: string): Promise<ProdutosEntity | null> {
    return this.produtosRepository.findOne({ where: { id } });
  }

  async findVariacaoById(id: string): Promise<VariacoesProdutoEntity | null> {
    return this.variacoesRepository.findOne({ where: { id } });
  }

  async updateProduto(
    id: string,
    data: Partial<ProdutosEntity>,
  ): Promise<void> {
    await this.produtosRepository.update(id, data);
  }

  async updateVariacao(
    id: string,
    data: Partial<VariacoesProdutoEntity>,
  ): Promise<void> {
    await this.variacoesRepository.update(id, data);
  }
}
