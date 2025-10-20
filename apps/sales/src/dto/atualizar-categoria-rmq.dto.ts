export interface AtualizarCategoriaRmqDto {
  id: string;
  nome?: string;
  descricao?: string;
  slug?: string;
  icone?: string;
  corHex?: string;
  ordem?: number;
  categoriaPaiId?: string;
  ativo?: boolean;
}
