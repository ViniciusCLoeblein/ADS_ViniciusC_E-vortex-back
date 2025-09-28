import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

@Injectable()
export class PostgresDatabaseService {
  constructor(
    private serviceName: string,
    private configService: ConfigService,
  ) {}

  public getConnectionPostgres(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get(`${this.serviceName}_DB_HOST`),
      port:
        parseInt(this.configService.get(`${this.serviceName}_DB_PORT`), 10) ||
        5432,
      username: this.configService.get(`${this.serviceName}_DB_USERNAME`),
      password: this.configService.get(`${this.serviceName}_DB_PASSWORD`),
      database: this.configService.get(`${this.serviceName}_DB_NAME`),
      entities: [join(__dirname, '**', 'entities', '**', '*.entity.{ts,js}')],
      synchronize: true, // Use `true` apenas em desenvolvimento, nunca em produção.
      autoLoadEntities: true,
      logging: true,
    };
  }
}
