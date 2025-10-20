export interface CriarCategoriaRmqDto {
  nome: string;
  descricao: string;
  slug: string;
  icone?: string;
  corHex?: string;
  ordem?: number;
  categoriaPaiId?: string;
}
