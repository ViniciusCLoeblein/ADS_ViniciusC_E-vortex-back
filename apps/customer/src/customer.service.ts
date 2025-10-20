import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CustomerRepository } from './customer.repository';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcryptjs';
import { EnderecosEntity } from 'apps/entities/enderecos.entity';
import {
  CriarEnderecoPayload,
  AtualizarEnderecoPayload,
} from './types/endereco.types';
import { CriarCartaoPayload, CartaoSeguro } from './types/cartao.types';
import { MessageResponse } from './types/response.types';

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

    // Se for principal, desmarcar outros
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

    // Se for principal, desmarcar outros
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

    // Hash do número e CVV
    const numeroHash = await bcrypt.hash(numero, 10);
    const cvvHash = await bcrypt.hash(cvv, 10);
    const ultimosDigitos = numero.slice(-4);

    // Se for principal, desmarcar outros
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

    // Retornar sem dados sensíveis
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

    // Retornar apenas dados não sensíveis
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

  // Pedidos
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
