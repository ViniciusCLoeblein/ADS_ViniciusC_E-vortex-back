import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { CustomerRepository } from './customer.repository';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcryptjs';
import { EnderecosEntity } from '../entities/enderecos.entity';
import {
  CriarEnderecoPayload,
  AtualizarEnderecoPayload,
} from './types/endereco.types';
import { CriarCartaoPayload, CartaoSeguro } from './types/cartao.types';
import { MessageResponse } from './types/response.types';
import { CriarPedidoDto } from './dto/criar-pedido.dto';
import { PedidoDetalheRes } from './types/customer.types';
import { ProdutosEntity } from '../entities/produtos.entity';

@Injectable()
export class CustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async criarEndereco(payload: CriarEnderecoPayload) {
    const {
      usuarioId,
      apelido,
      cep,
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      pais,
      principal,
    } = payload;

    if (principal) {
      await this.customerRepository.setPrincipalEndereco(usuarioId);
    }

    const endereco = await this.customerRepository.createEndereco({
      usuario_id: usuarioId,
      apelido,
      cep,
      logradouro,
      numero,
      complemento: complemento || null,
      bairro,
      cidade,
      estado,
      pais,
      principal: principal || false,
    });

    return endereco;
  }

  async listarEnderecos(usuarioId: string) {
    const enderecos =
      await this.customerRepository.findEnderecosByUsuario(usuarioId);
    return {
      enderecos,
      total: enderecos.length,
    };
  }

  async obterEndereco(id: string, usuarioId: string) {
    const endereco = await this.customerRepository.findEnderecoById(id);
    if (!endereco) {
      throw new NotFoundException('Endereço não encontrado');
    }
    if (endereco.usuario_id !== usuarioId) {
      throw new ForbiddenException('Acesso negado');
    }
    return endereco;
  }

  async atualizarEndereco(payload: AtualizarEnderecoPayload) {
    const { id, usuarioId, principal, ...data } = payload;

    const endereco = await this.customerRepository.findEnderecoById(id);
    if (!endereco) {
      throw new NotFoundException('Endereço não encontrado');
    }
    if (endereco.usuario_id !== usuarioId) {
      throw new ForbiddenException('Acesso negado');
    }

    if (principal && !endereco.principal) {
      await this.customerRepository.setPrincipalEndereco(usuarioId);
    }

    const updateData: Partial<EnderecosEntity> = {};
    if (data.apelido) updateData.apelido = data.apelido;
    if (data.cep) updateData.cep = data.cep;
    if (data.logradouro) updateData.logradouro = data.logradouro;
    if (data.numero) updateData.numero = data.numero;
    if (data.complemento !== undefined)
      updateData.complemento = data.complemento;
    if (data.bairro) updateData.bairro = data.bairro;
    if (data.cidade) updateData.cidade = data.cidade;
    if (data.estado) updateData.estado = data.estado;
    if (data.pais) updateData.pais = data.pais;
    if (principal !== undefined) updateData.principal = principal;

    await this.customerRepository.updateEndereco(id, updateData);

    return this.customerRepository.findEnderecoById(id);
  }

  async excluirEndereco(id: string, usuarioId: string) {
    const endereco = await this.customerRepository.findEnderecoById(id);
    if (!endereco) {
      throw new NotFoundException('Endereço não encontrado');
    }
    if (endereco.usuario_id !== usuarioId) {
      throw new ForbiddenException('Acesso negado');
    }

    await this.customerRepository.deleteEndereco(id);
    return { message: 'Endereço excluído com sucesso' };
  }

  async criarCartao(payload: CriarCartaoPayload): Promise<CartaoSeguro> {
    const {
      usuarioId,
      titular,
      numero,
      bandeira,
      mesValidade,
      anoValidade,
      cvv,
      principal,
    } = payload;

    const numeroHash = await bcrypt.hash(numero, 10);
    const cvvHash = await bcrypt.hash(cvv, 10);
    const ultimosDigitos = numero.slice(-4);

    if (principal) {
      await this.customerRepository.setPrincipalCartao(usuarioId);
    }

    const cartao = await this.customerRepository.createCartao({
      usuario_id: usuarioId,
      uuid: randomUUID(),
      titular,
      numero_hash: numeroHash,
      ultimos_digitos: ultimosDigitos,
      bandeira,
      mes_validade: mesValidade,
      ano_validade: anoValidade,
      cvv_hash: cvvHash,
      token_gateway: null,
      principal: principal || false,
      ativo: true,
    });

    return {
      id: cartao.id,
      uuid: cartao.uuid,
      titular: cartao.titular,
      ultimos_digitos: cartao.ultimos_digitos,
      bandeira: cartao.bandeira,
      mes_validade: cartao.mes_validade,
      ano_validade: cartao.ano_validade,
      principal: cartao.principal,
      ativo: cartao.ativo,
      criado_em: cartao.criado_em,
    };
  }

  async listarCartoes(usuarioId: string) {
    const cartoes =
      await this.customerRepository.findCartoesByUsuario(usuarioId);

    const cartoesSeguros = cartoes.map((c) => ({
      id: c.id,
      uuid: c.uuid,
      titular: c.titular,
      ultimos_digitos: c.ultimos_digitos,
      bandeira: c.bandeira,
      mes_validade: c.mes_validade,
      ano_validade: c.ano_validade,
      principal: c.principal,
      ativo: c.ativo,
      criado_em: c.criado_em,
    }));

    return {
      cartoes: cartoesSeguros,
      total: cartoesSeguros.length,
    };
  }

  async excluirCartao(id: string, usuarioId: string): Promise<MessageResponse> {
    const cartao = await this.customerRepository.findCartaoById(id);
    if (!cartao) {
      throw new NotFoundException('Cartão não encontrado');
    }
    if (cartao.usuario_id !== usuarioId) {
      throw new ForbiddenException('Acesso negado');
    }

    await this.customerRepository.deleteCartao(id);
    return { message: 'Cartão excluído com sucesso' };
  }

  async listarNotificacoes(usuarioId: string) {
    const notificacoes =
      await this.customerRepository.findNotificacoesByUsuario(usuarioId);
    return {
      notificacoes,
      total: notificacoes.length,
    };
  }

  async marcarComoLida(id: string, usuarioId: string) {
    const notificacao = await this.customerRepository.findNotificacaoById(id);
    if (!notificacao) {
      throw new NotFoundException('Notificação não encontrada');
    }
    if (notificacao.usuario_id !== usuarioId) {
      throw new ForbiddenException('Acesso negado');
    }

    await this.customerRepository.updateNotificacao(id, {
      lida: true,
      data_leitura: new Date(),
    });

    return { message: 'Notificação marcada como lida' };
  }

  async criarPedido(
    payload: CriarPedidoDto & { usuarioId: string },
  ): Promise<PedidoDetalheRes> {
    const {
      usuarioId,
      enderecoEntregaId,
      cartaoCreditoId,
      metodoPagamento,
      frete,
      desconto = 0,
      itens,
    } = payload;

    if (!itens || itens.length === 0) {
      throw new BadRequestException('Pedido sem itens');
    }

    const endereco =
      await this.customerRepository.findEnderecoById(enderecoEntregaId);
    if (endereco?.usuario_id !== usuarioId) {
      throw new ForbiddenException('Endereço inválido');
    }

    if (cartaoCreditoId) {
      const cartao =
        await this.customerRepository.findCartaoById(cartaoCreditoId);
      if (cartao?.usuario_id !== usuarioId) {
        throw new ForbiddenException('Cartão inválido');
      }
    }

    let subtotal = 0;

    const itensPreparados: Array<{
      produto: ProdutosEntity;
      variacaoId: string | null;
      quantidade: number;
      precoUnitario: number;
      variacaoDescricao: string | null;
    }> = [];

    for (const item of itens) {
      const produto = await this.customerRepository.findProdutoById(
        item.produtoId,
      );
      if (!produto) {
        throw new NotFoundException('Produto não encontrado');
      }

      const precoBase = Number.parseFloat(
        produto.precoPromocional || produto.preco,
      );

      let precoUnitario = precoBase;
      let variacaoDescricao: string | null = null;

      if (item.variacaoId) {
        const variacao = await this.customerRepository.findVariacaoById(
          item.variacaoId,
        );
        if (!variacao || variacao.produto_id !== produto.id) {
          throw new NotFoundException('Variação não encontrada');
        }
        if (variacao.estoque < item.quantidade) {
          throw new BadRequestException('Estoque insuficiente na variação');
        }
        const adicional = Number.parseFloat(variacao.preco_adicional || '0');
        precoUnitario = precoBase + adicional;
        variacaoDescricao = `${variacao.tipo}: ${variacao.valor}`;

        await this.customerRepository.updateVariacao(variacao.id, {
          estoque: variacao.estoque - item.quantidade,
        });
      } else {
        if (produto.estoque < item.quantidade) {
          throw new BadRequestException('Estoque insuficiente do produto');
        }
        await this.customerRepository.updateProduto(produto.id, {
          estoque: produto.estoque - item.quantidade,
        });
      }

      subtotal += precoUnitario * item.quantidade;

      itensPreparados.push({
        produto,
        variacaoId: item.variacaoId || null,
        quantidade: item.quantidade,
        precoUnitario,
        variacaoDescricao,
      });
    }

    const total = subtotal - (desconto || 0) + (frete || 0);

    const pedido = await this.customerRepository.createPedido({
      uuid: randomUUID(),
      usuario_id: usuarioId,
      endereco_entrega_id: enderecoEntregaId,
      cartao_credito_id: cartaoCreditoId || null,
      status: 'processando',
      subtotal: subtotal.toFixed(2),
      desconto: (desconto || 0).toFixed(2),
      frete: (frete || 0).toFixed(2),
      total: total.toFixed(2),
      metodo_pagamento: metodoPagamento,
      dados_pagamento: null,
    });

    await this.customerRepository.createItensPedido(
      itensPreparados.map((i) => ({
        pedido_id: pedido.id,
        produto_id: i.produto.id,
        variacao_id: i.variacaoId,
        quantidade: i.quantidade,
        preco_unitario: i.precoUnitario.toFixed(2),
        nome_produto: i.produto.nome,
        variacao_descricao: i.variacaoDescricao,
      })),
    );

    const itensSalvos = await this.customerRepository.findItensPedido(
      pedido.id,
    );

    return {
      ...pedido,
      itens: itensSalvos,
    };
  }

  async listarPedidos(usuarioId: string) {
    const pedidos =
      await this.customerRepository.findPedidosByUsuario(usuarioId);
    return {
      pedidos,
      total: pedidos.length,
    };
  }

  async obterPedido(id: string, usuarioId: string) {
    const pedido = await this.customerRepository.findPedidoById(id);
    if (!pedido) {
      throw new NotFoundException('Pedido não encontrado');
    }
    if (pedido.usuario_id !== usuarioId) {
      throw new ForbiddenException('Acesso negado');
    }

    const itens = await this.customerRepository.findItensPedido(id);

    return {
      ...pedido,
      itens,
    };
  }
}
