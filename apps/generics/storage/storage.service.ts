import { Injectable } from '@nestjs/common';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { MulterFile } from '../types/multer.types';

@Injectable()
export class StorageService {
  private readonly uploadDir = join(process.cwd(), 'uploads', 'produtos');

  async ensureUploadDir(): Promise<void> {
    if (!existsSync(this.uploadDir)) {
      await mkdir(this.uploadDir, { recursive: true });
    }
  }

  async saveFile(file: MulterFile, subfolder?: string): Promise<string> {
    await this.ensureUploadDir();

    const ext = file.originalname.split('.').pop();
    const filename = `${randomUUID()}.${ext}`;
    const folder = subfolder ? join(this.uploadDir, subfolder) : this.uploadDir;

    if (!existsSync(folder)) {
      await mkdir(folder, { recursive: true });
    }

    const filepath = join(folder, filename);
    await writeFile(filepath, file.buffer);

    // Retorna a URL relativa
    return subfolder
      ? `/uploads/produtos/${subfolder}/${filename}`
      : `/uploads/produtos/${filename}`;
  }

  async deleteFile(url: string): Promise<void> {
    try {
      const filepath = join(process.cwd(), url);
      if (existsSync(filepath)) {
        await unlink(filepath);
      }
    } catch (error) {
      console.error('Erro ao deletar arquivo:', error);
    }
  }
}
