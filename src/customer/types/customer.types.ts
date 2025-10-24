import { ApiProperty } from '@nestjs/swagger';

export class EnderecoRes {
  @ApiProperty()
  id: string;

  @ApiProperty()
  usuario_id: string;

  @ApiProperty()
  apelido: string;

  @ApiProperty()
  cep: string;

  @ApiProperty()
  logradouro: string;

  @ApiProperty()
  numero: string;

  @ApiProperty({ nullable: true })
  complemento: string | null;

  @ApiProperty()
  bairro: string;

  @ApiProperty()
  cidade: string;

  @ApiProperty()
  estado: string;

  @ApiProperty()
  pais: string;

  @ApiProperty()
  principal: boolean;

  @ApiProperty()
  criado_em: Date;

  @ApiProperty()
  atualizado_em: Date;
}

export class ListaEnderecosRes {
  @ApiProperty({ type: [EnderecoRes] })
  enderecos: EnderecoRes[];

  @ApiProperty()
  total: number;
}

export class CartaoRes {
  @ApiProperty()
  id: string;

  @ApiProperty()
  uuid: string;

  @ApiProperty()
  titular: string;

  @ApiProperty()
  ultimos_digitos: string;

  @ApiProperty()
  bandeira: string;

  @ApiProperty()
  mes_validade: number;

  @ApiProperty()
  ano_validade: number;

  @ApiProperty()
  principal: boolean;

  @ApiProperty()
  ativo: boolean;

  @ApiProperty()
  criado_em: Date;
}

export class ListaCartoesRes {
  @ApiProperty({ type: [CartaoRes] })
  cartoes: CartaoRes[];

  @ApiProperty()
  total: number;
}

export class NotificacaoRes {
  @ApiProperty()
  id: string;

  @ApiProperty()
  usuario_id: string;

  @ApiProperty()
  tipo: string;

  @ApiProperty()
  titulo: string;

  @ApiProperty()
  mensagem: string;

  @ApiProperty({ nullable: true })
  url_acao: string | null;

  @ApiProperty()
  lida: boolean;

  @ApiProperty({ nullable: true })
  data_leitura: Date | null;

  @ApiProperty({ nullable: true })
  enviada_em: Date | null;
}

export class ListaNotificacoesRes {
  @ApiProperty({ type: [NotificacaoRes] })
  notificacoes: NotificacaoRes[];

  @ApiProperty()
  total: number;
}

export class PedidoRes {
  @ApiProperty()
  id: string;

  @ApiProperty()
  uuid: string;

  @ApiProperty()
  usuario_id: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  subtotal: string;

  @ApiProperty()
  desconto: string;

  @ApiProperty()
  frete: string;

  @ApiProperty()
  total: string;

  @ApiProperty()
  metodo_pagamento: string;

  @ApiProperty({ nullable: true })
  codigo_rastreamento: string | null;

  @ApiProperty()
  criado_em: Date;
}

export class ListaPedidosRes {
  @ApiProperty({ type: [PedidoRes] })
  pedidos: PedidoRes[];

  @ApiProperty()
  total: number;
}

export class ItemPedidoRes {
  @ApiProperty()
  id: string;

  @ApiProperty()
  produto_id: string;

  @ApiProperty()
  quantidade: number;

  @ApiProperty()
  preco_unitario: string;

  @ApiProperty()
  nome_produto: string;

  @ApiProperty({ nullable: true })
  variacao_descricao: string | null;
}

export class PedidoDetalheRes extends PedidoRes {
  @ApiProperty({ type: [ItemPedidoRes] })
  itens: ItemPedidoRes[];
}

export class MessageRes {
  @ApiProperty()
  message: string;
}
