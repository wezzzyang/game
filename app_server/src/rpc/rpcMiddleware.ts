/*
 * @Descripttion: RPC拦截器
 * @version: 1.0.0
 * @Author: Adu
 * @Date: 2021-05-26 18:23:01
 * @LastEditors: Adu
 * @LastEditTime: 2021-06-22 16:34:09
 */
import { Provide } from '@midwayjs/decorator';
import { IWebMiddleware, IMidwayWebNext } from '@midwayjs/web';
import { Context } from 'egg';
import { isRpcRequest, service } from '../lib/rpcDecorator';
// 只有需要使用RPC中间件的时候，@RpcMiddlewareClass() 和 @RpcMiddlewareMethod搭配使用
import {
  RpcNextInvokeHandler,
  RpcContext,
  RpcMiddlewareClass,
  RpcMiddlewareServer,
  RpcMiddlewareClient,
} from '../lib/rpcDecorator';

@RpcMiddlewareClass()
@Provide()
export class RpcMiddleware implements IWebMiddleware {
  /**
   * 控制rpc请求时，不走http的分发器
   * @returns
   */
  resolve() {
    return async (ctx: Context, next: IMidwayWebNext) => {
      if (isRpcRequest(ctx)) {
        //TODO 客户端连接时候的日志打印
        // 客户端连接ctx.request.header.connection === 'keep-alive'
        // 推送监听：ctx.request.header.connection === 'close'
        return await service.http.handler(ctx.req, ctx.res);
      }
      await next();
    };
  }

  /**
   * RPC的路由拦截器
   * @param fullname 访问的方法
   * @param args 请求参数
   * @param context 上下文对象
   * @param next
   * @returns
   */
  @RpcMiddlewareServer(10)
  async serverMiddleware(
    fullname: string,
    args: any[],
    context: RpcContext,
    next: RpcNextInvokeHandler
  ): Promise<any> {
    try {
      return await next(fullname, args, context);
    } catch (error) {
      //TODO： 服务端报错，存入日志
      return {
        code: error.code || 500,
        message: error.message,
        stack: error.stack,
      };
    }
  }
  /**
   * 客户端发送请求的拦截器
   * @param fullname
   * @param args
   * @param context
   * @param next
   * @returns
   */
  @RpcMiddlewareClient('selfRpcServer')
  async clientMiddleware(
    fullname: string,
    args: any[],
    context: RpcContext,
    next: RpcNextInvokeHandler
  ): Promise<any> {
    // 结合业务需求，可将用户信息封装到rpc的请求头中，默认是项目的编号
    // context.requestHeaders['m-t-k'] = '';
    return await next(fullname, args, context);
  }
}
