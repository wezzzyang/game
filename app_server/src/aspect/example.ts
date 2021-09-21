/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: Adu
 * @Date: 2021-05-20 16:16:27
 * @LastEditors: Adu
 * @LastEditTime: 2021-06-10 10:49:37
 */
import {
  // Aspect,
  IMethodAspect,
  Logger,
  JoinPoint,
  // Provide,
} from '@midwayjs/decorator';
// import { ExampleController } from '../controller/example';
import { ILogger } from '@midwayjs/logger';

// @Provide()
// @Aspect(ExampleController, '*')
export class ExampleAspect implements IMethodAspect {
  @Logger()
  logger: ILogger;
  /*
    说明：JoinPoint的解释说明
    */
  async before(point: JoinPoint) {
    this.logger.info('方法调用前执行, 可以修改传入参数、调用原方法');
  }
  async around(point: JoinPoint) {
    this.logger.info(
      '包裹方法的前后执行, 可以修改传入参数、调用原方法、获取返回值、获取错误、拦截并抛出错误'
    );
  }
  async afterReturn(point: JoinPoint, result: any) {
    this.logger.info('正确返回内容时执行, 可以获取返回值');
  }
  async afterThrow(point: JoinPoint, error: Error) {
    this.logger.info('抛出异常时执行, 可以获取错误、拦截并抛出错误');
  }
  async after(point: JoinPoint, result, error: Error) {
    this.logger.info('最后执行（不管正确还是错误）, 可以获取返回值、获取错误');
  }
}
