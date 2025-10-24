export interface CriarCartaoPayload {
  usuarioId: string;
  titular: string;
  numero: string;
  bandeira: string;
  mesValidade: number;
  anoValidade: number;
  cvv: string;
  principal?: boolean;
}

export interface CartaoSeguro {
  id: string;
  uuid: string;
  titular: string;
  ultimos_digitos: string;
  bandeira: string;
  mes_validade: number;
  ano_validade: number;
  principal: boolean;
  ativo: boolean;
  criado_em: Date;
}

export interface ListarCartoesResponse {
  cartoes: CartaoSeguro[];
  total: number;
}

export interface ExcluirCartaoPayload {
  id: string;
  usuarioId: string;
}
