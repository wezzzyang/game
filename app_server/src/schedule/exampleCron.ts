// src/schedule/hello.ts
import { Provide, Inject, Schedule, CommonSchedule } from '@midwayjs/decorator';
import { ILogger } from '@midwayjs/logger';
import { Context } from 'egg';

/**
 * 日志定时任务
 * 推荐使用 CommonSchedule 接口来规范你的计划任务类。
 * 测试：
 *  方法一：
 *      // 参数的格式变为 id#className ，id 为依赖注入的标识符（类名的驼峰）
 *      app.runSchedule('exampleCron#ExampleCron');
 *  方法二：
 *      const exampleCron = await ctx.requestContext.getAsync<ExampleCron>('exampleCron');
 *      await exampleCron.exec();
说明：
*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    |
│    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
│    │    │    │    └───── month (1 - 12)
│    │    │    └────────── day of month (1 - 31)
│    │    └─────────────── hour (0 - 23)
│    └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, optional)
 */
@Provide()
@Schedule({
  cron: '0 0 0 * * *', // 每天0点执行
  type: 'worker', // 指定某一个 worker 执行
})
export class ExampleCron implements CommonSchedule {
  @Inject()
  logger: ILogger;

  @Inject()
  ctx: Context;

  // 定时执行的具体任务
  async exec() {
    this.ctx.logger.info(process.pid, '定时任务执行');
    this.logger.info('定时任务开始执行');
    const startTime = Date.now();
    this.logger.info(`定时任务结束，耗时:${Date.now() - startTime}ms`);
  }
}
