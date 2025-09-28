import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor() {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const parsedException = this.parseException(exception);

    const exceptionStatusMap: Record<string, HttpStatus> = {
      UnauthorizedException: HttpStatus.UNAUTHORIZED,
      BadRequestException: HttpStatus.BAD_REQUEST,
      NotFoundException: HttpStatus.NOT_FOUND,
    };

    const matchedStatus = this.matchExceptionStatus(
      parsedException,
      exceptionStatusMap,
    );
    const status = matchedStatus || this.getFallbackStatus(parsedException);

    const errorResponse = this.getErrorResponse(parsedException, request);
    return response.status(status).json(errorResponse);
  }

  private parseException(exception: unknown): any {
    if (typeof exception === 'string') {
      try {
        return JSON.parse(exception);
      } catch {
        return { message: exception };
      }
    }
    return exception;
  }

  private matchExceptionStatus(
    exception: any,
    statusMap: Record<string, HttpStatus>,
  ): HttpStatus | undefined {
    const messageMatch = Object.keys(statusMap).find((key) =>
      exception?.message?.includes(key),
    );
    if (messageMatch) {
      return statusMap[messageMatch];
    }

    const nameMatch = Object.keys(statusMap).find((key) =>
      exception?.name?.includes(key),
    );
    return nameMatch ? statusMap[nameMatch] : undefined;
  }

  private getFallbackStatus(exception: any): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }
    return (
      exception?.status ||
      exception?.statusCode ||
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }

  private getErrorResponse(exception: any, request: any): any {
    const status = this.getFallbackStatus(exception);

    const defaultErrorResponse = {
      status,
      message: exception?.message || 'Internal server error',
      path: request.url,
      method: request.method,
    };

    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      if (typeof response === 'string') {
        return {
          ...defaultErrorResponse,
          error: response,
        };
      }

      if (typeof response === 'object') {
        return {
          ...defaultErrorResponse,
          ...response,
        };
      }
    }

    return defaultErrorResponse;
  }
}
