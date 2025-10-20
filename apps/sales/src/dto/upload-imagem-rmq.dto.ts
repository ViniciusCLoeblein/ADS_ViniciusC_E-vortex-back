export interface UploadImagemRmqDto {
  produtoId: string;
  tipo: string;
  legenda?: string;
  ordem?: number;
  file: {
    originalname: string;
    mimetype: string;
    size: number;
    buffer: Buffer;
  };
}
