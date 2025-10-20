import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RedocModule } from 'nest-redoc';
import { AllExceptionsFilter } from 'apps/generics/filters/rpc-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'verbose', 'debug', 'log'],
  });

  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads',
  });

  const config = new DocumentBuilder()
    .setTitle('Trabalho faculdade Services')
    .setDescription('Trabalho - Acesso a todos os serviços fornecidos')
    .setVersion('1.0')
    .addBearerAuth()
    .setContact('Vinicius', '', '198779@upf.br')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api', app, document, {
    explorer: true,
    swaggerOptions: {
      docExpansion: 'none',
      filter: true,
    },
  });
  RedocModule.setup('/docs', app, document, {});

  app.enableCors();
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
    }),
  );

  await app.listen(3000);
}

bootstrap();
