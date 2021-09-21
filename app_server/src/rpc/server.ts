/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: Adu
 * @Date: 2021-05-26 19:57:57
 * @LastEditors: Adu
 * @LastEditTime: 2021-06-22 17:40:05
 */
import { Provide, Inject } from '@midwayjs/decorator';
import { RpcController, Rpc, RpcContext, RpcSubscribe, RpcPublish } from '../lib/rpcDecorator';
import { BaseDefault, ResultData} from '../lib/baseDefault'
import { testDTO } from './rpcInterface';
import { ExampleService } from '../service/example';
@Provide()
@RpcController()
export class ExampleRpc extends BaseDefault{

  @Inject()
  exampleService: ExampleService;

  // 自定义方法名(非必传参数，默认方法名称)
  @Rpc('testRpc')
  async findAll(param: any, ctx: RpcContext): Promise<ResultData> {
    console.log('[RPC]testRpc方法接收到的参数: ', param);
    // await this.exampleService.findAll();
    return this.SUCCESS_200().setData(param);
  }

  @Rpc()
  async findById(param: testDTO, ctx: RpcContext): Promise<ResultData> {
    // await this.exampleService.findById(param.id);
    return this.SUCCESS_200().setData(param);
  }

  /**
   * 系统中通过ioc调用该方法，即可实现发布，详情查看@RpcPublish 注释
   * @param param 接受参数对象，支持多个参数
   * @returns 返回ResultData对象，会由订阅者接受
   */
  @RpcPublish('pushTest')
  async pushTest(param: any): Promise<ResultData> {
    let result = await this.exampleService.getUser({ uid: param });
    return this.SUCCESS_200().setData(result);
  }
  
  /**
   * 订阅某个服务的某个方法，详情查看@RpcSubscribe 注释
   * @param param 订阅只能接受一个参数
   * @returns 无需返回值
   */
  @RpcSubscribe('wpRpcServer', 'pushTest')
  async subscribeTest(param: any) {
    // await this.exampleService.findById(param.id);
    console.log('subscribeTest', param);
  }
}
;