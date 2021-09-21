import { Logger, Provide } from '@midwayjs/decorator';
import { IWebMiddleware, IMidwayWebNext } from '@midwayjs/web';
import { Context } from 'egg';
import { ILogger } from '@midwayjs/logger';
import { parseLoginToken } from '../utils/jwtUtils';
@Provide()
export class GlobalMiddleware implements IWebMiddleware {
  @Logger()
  logger: ILogger;

  resolve() {
    // todo： 1. 异常处理； 2. 统一日志处理； 3. 业务拦截器
    return async (ctx: Context, next: IMidwayWebNext): Promise<void> => {
      // 获取用户信息
      ctx.user = await parseLoginToken(ctx.request);
      // 控制器前执行的逻辑
      const startTime = Date.now();
      await next();
      this.logger.info(`请求时长：${Date.now() - startTime}ms`);
    };
  }
}
