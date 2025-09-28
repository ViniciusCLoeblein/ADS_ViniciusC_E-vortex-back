import { BadRequestException, Catch, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
import { EntityNotFoundError } from 'typeorm';

@Catch()
export class IExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException): Observable<never> {
    if (exception instanceof BadRequestException) {
      return throwError(() =>
        new RpcException(JSON.stringify(exception)).getError(),
      );
    }

    if (exception instanceof EntityNotFoundError) {
      return throwError(() =>
        new RpcException(JSON.stringify(exception)).getError(),
      );
    }

    return throwError(() => new RpcException('' + exception));
  }
}
