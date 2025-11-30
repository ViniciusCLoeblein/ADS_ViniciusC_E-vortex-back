import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

@Injectable()
export class PostgresDatabaseService {
  private readonly logger: Logger;
  constructor(
    private readonly serviceName: string,
    private readonly configService: ConfigService,
  ) {}

  public getConnectionPostgres(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      username: this.configService.get(`DATA_BASE_USER`),
      password: this.configService.get(`DATA_BASE_PASSWORD`),
      host: this.configService.get(`DATA_BASE_HOST`),
      port: this.configService.get(`DATA_BASE_PORT`, 5432),
      database: this.configService.get(`DATA_BASE_DB`),
      entities: [join(__dirname, '**', 'entities', '**', '*.entity.{ts,js}')],
      synchronize: true,
      autoLoadEntities: true,
      logging: false,
      ssl: true,
      extra: {
        ssl: {
          rejectUnauthorized: false,
          ca: this.configService.get(`DATA_BASE_CA`)?.replace(/\\n/g, '\n'),
        },
        poolMax: 10,
        poolMin: 3,
        poolIncrement: 5,
        poolTimeout: 5,
        queueTimeout: 50000,
        sessionCallback: (connection, requestedTag, callback) => {
          connection
            .execute(
              `BEGIN DBMS_SESSION.SET_IDENTIFIER('${this.serviceName}'); END;`,
            )
            .then(() => {
              this.logger.log(
                `Session for ${this.serviceName} successfully started`,
              );
              callback();
            })
            .catch((err) => {
              this.logger.error(
                `Error setting session identifier for ${this.serviceName}: ${err.message}`,
                err.stack,
              );
              callback(err);
            });
        },
      },
    } as TypeOrmModuleOptions;
  }
}
