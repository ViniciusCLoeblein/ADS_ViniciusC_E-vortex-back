export interface AtualizarVariacaoRmqDto {
  id: string;
  tipo?: string;
  valor?: string;
  sku?: string;
  precoAdicional?: number;
  estoque?: number;
  ordem?: number;
}
