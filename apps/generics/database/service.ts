import { Injectable, Inject, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class PostgresService implements OnApplicationBootstrap {
  constructor(
    private readonly dataSource: DataSource, // DataSource para gerenciar a conexão.
    @Inject('CLIENT_IDENTIFIER') private readonly clientIdentifier: string, // Identificador do cliente.
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    try {
      if (!this.dataSource.isInitialized) {
        await this.dataSource.initialize(); // Garante que o DataSource está inicializado.
      }

      // Define o identificador do cliente na sessão do PostgreSQL.
      await this.dataSource.query(
        `SET application_name = $1`, // Usando `application_name` para rastreamento.
        [this.clientIdentifier],
      );
    } catch (error) {
      console.error(
        'Erro ao configurar o identificador do cliente no PostgreSQL:',
        error,
      );
    }
  }
}
