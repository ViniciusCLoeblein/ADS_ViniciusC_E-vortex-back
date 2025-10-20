export interface CriarVariacaoRmqDto {
  produtoId: string;
  tipo: string;
  valor: string;
  sku: string;
  precoAdicional?: number;
  estoque: number;
  ordem?: number;
}
