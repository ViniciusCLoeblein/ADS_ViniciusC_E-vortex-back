import { Injectable, Inject, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class PostgresService implements OnApplicationBootstrap {
  constructor(
    private readonly dataSource: DataSource,
    @Inject('CLIENT_IDENTIFIER') private readonly clientIdentifier: string,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    try {
      if (!this.dataSource.isInitialized) {
        await this.dataSource.initialize();
      }

      await this.dataSource.query(`SET application_name = $1`, [
        this.clientIdentifier,
      ]);
    } catch (error) {
      console.error(
        'Erro ao configurar o identificador do cliente no PostgreSQL:',
        error,
      );
    }
  }
}
