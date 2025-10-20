export interface CriarProdutoRmqDto {
  usuarioId: string;
  categoriaId: string;
  sku: string;
  nome: string;
  descricao: string;
  descricaoCurta: string;
  preco: number;
  precoPromocional?: number;
  pesoKg: number;
  alturaCm: number;
  larguraCm: number;
  profundidadeCm: number;
  estoque: number;
  estoqueMinimo: number;
  tags?: string;
  destaque?: boolean;
  ativo?: boolean;
}
