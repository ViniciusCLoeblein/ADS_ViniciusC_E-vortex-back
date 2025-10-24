import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { Public } from './generics/decorators/public-decorator';

@Controller('health')
export class HealthCheckController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
  ) {}

  @HealthCheck()
  @Get()
  @Public()
  check() {
    return this.health.check([
      () =>
        this.db.pingCheck('database', {
          timeout: 5000,
        }),
    ]);
  }
}
