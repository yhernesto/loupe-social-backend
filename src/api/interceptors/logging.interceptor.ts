import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppLoggerService } from 'src/shared/modules/app-logger/app-logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly appLogger = new AppLoggerService(LoggingInterceptor.name);
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();

        const reqMethod = request.method;
        const reqUrl = request.url;
        const statusCode = response.statusCode;
        const userAgent = request.headers['user-agent']
        const latency = Date.now() - now;
        const message = request.route.path
        this.appLogger.httpLogging(reqMethod, message, reqUrl, statusCode, latency, userAgent, 0)
      }),
    );
  }
}
