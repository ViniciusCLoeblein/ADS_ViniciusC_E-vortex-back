import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class RmqService {
  constructor(
    public serviceName: string,
    private readonly configService?: ConfigService,
  ) {}

  public getConnectionRmq(): ClientOptions {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [
          {
            vhost: '/',
            protocol: 'amqp',
            hostname: this.configService.get('HOST_RMQ'),
            port: parseInt(this.configService.get('PORT_RMQ')),
            locale: 'pt_BR',
            username: this.configService.get('USERNAME_RMQ'),
            password: this.configService.get('PASSWORD_RMQ'),
          },
        ],
        queue: this.configService.get(this.serviceName + '_QUEUE'),
        queueOptions: {
          durable: false,
        },
        socketOptions: {
          timeout: 60,
          noDelay: false,
          keepAlive: true,
        },
      },
    };
  }
}
