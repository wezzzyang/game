import {
  All,
  ALL,
  Body,
  Config,
  Controller,
  Del,
  Get,
  Inject,
  Param,
  Post,
  Provide,
  Put,
  Queries,
  Query,
  RequestIP,
  RequestPath,
} from '@midwayjs/decorator';
import { CreateApiDoc } from '@midwayjs/swagger';
import { Context } from 'egg';
import { BaseController, ResultData } from '../lib/baseController';
import { CacheManager } from '@midwayjs/cache';
import { ILogger } from '@midwayjs/logger';
import { WpRpcServer } from '../rpc/rpcInterface';
import { ExampleRpc } from '../rpc/server';
import { ExampleVO } from '../interface/VO/example';
/**
 * 路由定义机器注解API: https://www.yuque.com/midwayjs/midway_v2/controller#mDTug
 * Swagger注解API文档：https://www.yuque.com/midwayjs/midway_v2/swagger
 */
@Provide()
@Controller('/api/example', {
  tagName: '用例',
  description: '框架案例，其中展示了基础CRUD操作',
})
export class ExampleController extends BaseController {
  // 依赖注入ctx上下文变量
  @Inject()
  ctx: Context;
  //依赖注入CacheManager
  @Inject('cache:cacheManager')
  cache: CacheManager;
  // 依赖注入config文件夹下面的配置
  @Config(ALL)
  // @Config('dbConfig.user')
  // @Config('dbConfig')
  dbConfig;
  // rpc连接客户端
  @Inject()
  wpRpcServer: WpRpcServer;

  @Inject()
  logger: ILogger;
  @Inject()
  exampleRpc: ExampleRpc;

  @(CreateApiDoc()
    .summary('模拟RPC触发的发布订阅-发布者')
    .description('模拟发送RPC请求')
    .build())
  @Get('/sendRpcPublisher')
  async sendRpcPublisher():Promise<ResultData> {
    const result = await this.exampleRpc.pushTest({id:123});
    return this.SUCCESS_200().setData(result);
  }
  @(CreateApiDoc()
    .summary('模拟发送RPC请求')
    .description('模拟发送RPC请求')
    .build())
  @Get('/sendRpcRequest')
  async sendRpcRequest():Promise<ResultData> {
    const result = await this.wpRpcServer.testRpc({id:123});
    console.log('result: ', result);
    return this.SUCCESS_200().setData(result);
  }

  @(CreateApiDoc() // @CreateApiDoc 装饰器最后需要跟一个 build 方法作为结尾
    .summary('根据名称查找')
    .description('功能描述 - description')
    .param('user', {
      // 参数名称，参数描述
      required: true, // 参数是否必须，默认false
      description: 'URL参数', // 参数描述
      example: {
        // 参数的示例
        name: '张三',
      },
      deprecated: false, // 参数是否废弃，默认false，可不写
      allowEmptyValue: false, // 参数是否允许控制，默认true，可不写
    })
    .build()) // 最后必须以bulid方法结尾
  @Get('/findByName')
  @Get('/findName')
  async findByName(@Query() name: string):Promise<ResultData> {
    this.logger.info(`查找成功，${name}`);
    return this.SUCCESS_200().setData(`查找成功，${name}`);
  }

  @(CreateApiDoc()
    .summary('获取缓存内容')
    .description('Get请求，获取缓存内容，使用方法可查看cache-manager这个库')
    .build())
  @Get('/getContentToCache')
  async getContentToCache():Promise<ResultData> {
    const result = await this.cache.get('name'); //获取缓存内容
    return this.SUCCESS_200().setData(result);
  }

  @(CreateApiDoc()
    .summary('获取系统配置变量')
    .description('Get请求，获取系统配置变量，在config目录下面配置的')
    .build())
  @Get('/getConfig')
  async getConfig():Promise<ResultData> {
    console.log(this.dbConfig.projectName);
    return this.SUCCESS_200().setData(this.dbConfig);
  }

  @(CreateApiDoc()
    .summary('根据数组查找')
    .description('GET请求，在Get请求中直接接受数组对象')
    .build())
  @Get('/findByArr')
  async findByArr(@Queries() arr):Promise<ResultData>{
    return this.SUCCESS_200().setData(`接受到的数组:${arr}`);
  }

  @(CreateApiDoc()
    .summary('其他注解能够获取到的参数')
    .description('获取')
    .build())
  @Get('/getRequestParam')
  async getRequestParam(
    @RequestPath() path: string,
    @RequestIP() ip: string
  ): Promise<ResultData> {
    return this.SUCCESS_200().setData(`@RequestPath(): ${path}\n@RequestIP():${ip}`);
  }
  
  
  @(CreateApiDoc()
    .summary('发送请求')
    .description('发送get/post/put/delete请求，文档地址：https://eggjs.org/zh-cn/core/httpclient.html')
    .build())
  @Get('/sendRequest')
  async sendRequest(): Promise<ResultData> {
    let response = await this.ctx.curl('https://registry.npm.taobao.org/egg/latest', {
      // 自动解析 JSON response
      dataType: 'json',
      // 3 秒超时
      timeout: 3000,
    });
    return this.SUCCESS_200().setData(response);
  }

  @(CreateApiDoc()
    .summary('保存')
    .description('POST请求，body里面的参数全部都接受到一个变量中')
    .build())
  @Post('/save')
  async save(
    @Body(ALL) body: ExampleVO,
    @Body() id: number,
    @Body() name: number
  ): Promise<ResultData> {
    /**
     * @Body() id:number 等价于 ctx.request.body.id
     *
     */
     return this.SUCCESS_200().setData(`已成功保存数据:${JSON.stringify(body)}`);
  }

  @(CreateApiDoc()
    .summary('设置缓存内容')
    .description('POST请求，设置缓存内容')
    .build())
  @Post('/setContentToCache')
  async setContentToCache(@Body(ALL) options: ExampleVO): Promise<ResultData> {
    await this.cache.set('name', 'test'); // 设置缓存内容
    const result = await this.cache.get('name');
    return this.SUCCESS_200().setData(result);
  }

  @(CreateApiDoc()
    .summary('根据id修改名称')
    .description(
      'PUT请求，接受固定参数，且设置接受的变量名称，转换为自己的变量名称'
    )
    .build())
  @Put('/updateNameById')
  async updateNameById(@Body(ALL) exampleVO: ExampleVO): Promise<ResultData>{
    return this.SUCCESS_200().setData(`已成功修改id为：${exampleVO.id} 的名称为：${exampleVO.name}`);
  }

  @(CreateApiDoc()
    .summary('根据id修改名称')
    .description('DELETE请求，路由参数，根据ID删除记录')
    .build())
  @Del('/deleteById/:id')
  async deleteById(@Param() id: number): Promise<ResultData>{
    return this.SUCCESS_200().setData(`已成功删除${id}`);
  }

  @(CreateApiDoc()
    .summary('无论什么请求都会触发')
    .description(
      '无论什么请求都会触发，@Query(ALL)会将所有get请求过来的值变为对象'
    )
    .build())
  @All('/allRequest')
  async allRequest(@Query(ALL) getPararm, @Body(ALL) body): Promise<ResultData>{
    return this.SUCCESS_200().setData(`触发所有请求，接受到的参数有：Query(ALL)：${getPararm}, @Body(ALL)：${body}`);
  }

  @(CreateApiDoc()
    .summary('清空缓存内容')
    .description('Dele请求，清空缓存内容')
    .build())
  @Del('/resetToCache')
  async resetToCache(): Promise<ResultData> {
    this.cache.reset()
    return this.SUCCESS_200().setData('清空对应store的内容');
  }
}
