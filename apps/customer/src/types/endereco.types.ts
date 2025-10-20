export interface CriarEnderecoPayload {
  usuarioId: string;
  apelido: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  pais: string;
  principal?: boolean;
}

export interface ObterEnderecoPayload {
  id: string;
  usuarioId: string;
}

export interface AtualizarEnderecoPayload {
  id: string;
  usuarioId: string;
  apelido?: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  pais?: string;
  principal?: boolean;
}

export interface ExcluirEnderecoPayload {
  id: string;
  usuarioId: string;
}
