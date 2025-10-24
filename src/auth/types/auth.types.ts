export interface AuthTokenResponse {
  userId: string;
  accessToken: string;
  accessTokenExpiresAt: string;
}

export interface TestResponse {
  status: string;
}

export interface NewUserInput {
  uuid: string;
  nome: string;
  email: string;
  senhaHash: string;
  cpf: string;
  tipo: string;
  telefone: string | null;
  avatarUrl: string | null;
  dataNascimento: string | Date | null;
  aceitaMarketing: boolean;
  emailVerificado: boolean;
  ultimoLogin: Date | null;
}
