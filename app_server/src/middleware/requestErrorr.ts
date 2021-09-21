import { Logger, Provide } from '@midwayjs/decorator';
import { IWebMiddleware, IMidwayWebNext } from '@midwayjs/web';
import { Context } from 'egg';
import { ILogger } from '@midwayjs/logger';

// 异常信息
@Provide()
export class requestErrorrMiddleware implements IWebMiddleware {
  @Logger()
  logger: ILogger;

  resolve() {
    return async (ctx: Context, next: IMidwayWebNext): Promise<void> => {
      ctx.set('Access-Control-Allow-Origin', '*');
      ctx.set(
        'Access-Control-Allow-Methods',
        'POST, GET, OPTIONS, DELETE, PUT, HEAD'
      );
      ctx.set('Access-Control-Max-Age', '3600');
      ctx.set('Access-Control-Allow-Headers', '*');
      ctx.set('Access-Control-Allow-Credentials', 'true');
      ctx.set(
        'Content-Security-Policy',
        "default-src 'self' 'unsafe-inline'; script-src 'self'; frame-ancestors 'self'; object-src 'none'"
      );
      ctx.set('X-Content-Type-Options', 'nosniff');
      ctx.set('X-XSS-Protection', '1; mode=block');
      if (ctx.method.toLowerCase() === 'options') {
        ctx.status = 200;
        ctx.body = { code: 200 };
      }
      try {
        await next();
      } catch (err: any) {
        // 有异常抛出
        ctx.body = {
          code: err.code || 500,
          message: err.message,
          stack: err.stack,
        };
        ctx.logger.error(err);
      }
    };
  }
}
