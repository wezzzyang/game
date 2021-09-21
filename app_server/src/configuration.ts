/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: Adu
 * @Date: 2021-05-20 16:16:27
 * @LastEditors: Adu
 * @LastEditTime: 2021-06-10 17:18:45
 */
import { Configuration, App } from '@midwayjs/decorator';
import {
  ILifeCycle,
  MidwayContainer,
  IMidwayApplication,
} from '@midwayjs/core';
import * as swagger from '@midwayjs/swagger';
import * as cache from '@midwayjs/cache'; // 导入cacheComponent模块
import { join } from 'path';
import * as dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import * as orm from '@midwayjs/orm';
import { initRpc } from './lib/rpcDecorator';
import { initLogger } from './lib/logger';
import * as prometheus from '@midwayjs/prometheus'; // 导入prometheus 性能
import { Application } from 'egg';
// import { Application as SocketApplication } from '@midwayjs/socketio';

@Configuration({
  /*
    说明：组件加载处
    方式一：直接写引入的组件
    方式二：传入对象
      {
        component: orm, // 引入的组件
        enabledEnvironment: ['local'] // 组件启用的环境数组
      }
   */
  imports: [
    swagger,
    cache, // 导入 cache 组件
    orm,
    prometheus,
  ],
  importConfigs: [join(__dirname, 'config')],
  conflictCheck: true,
})
// 实现ILifeCycle接口可控制生命周期
export class ContainerLifeCycle implements ILifeCycle {
  @App()
  app: Application;

  // @App(MidwayFrameworkType.WS_IO)
  // socketApp: SocketApplication;
  /**
   * 在应用 ready 的时候执行
   * @param container IoC 容器
   * @param app 应用 app
   */
  async onReady(
    container: MidwayContainer,
    app: IMidwayApplication
  ): Promise<void> {
    // this.socketApp.on('connection', () => {});
    // dayjsAPI文档：https://dayjs.gitee.io/docs/zh-CN/installation/installation
    dayjs.extend(weekOfYear);
    // 注册自定义logger
    initLogger(container, app);
    // 加载rpc
    await initRpc(container, app);
  }
  /**
   * 在应用停止的时候执行
   * @param container IoC 容器
   * @param app 应用 app
   */
  async onStop(): Promise<void> {
    //TODO rpc监听销毁程序
  }
}
