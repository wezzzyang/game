// 日志封装,注册自定义日志
import { MidwayContainer, IMidwayApplication } from '@midwayjs/core';
import { MidwayContextLogger } from '@midwayjs/logger';
import { Context } from 'egg';
import { join } from 'path';
import { loggers, LoggerOptions } from '@midwayjs/logger';
const pJson = require('../../package.json');
// 改写ctx
class MidwayCustomContextLogger extends MidwayContextLogger<Context> {
  error(err): void {
    const ctx = this.ctx;
    loggers.getLogger('REQUEST_ERROR').error(err, {
      label: `-/${ctx.host}/-/${Date.now() - ctx.startTime}ms ${ctx.method} ${
        ctx.url
      }`,
      params: {
        query: ctx.query,
        body: ctx.request.body,
      },
      userInfo: ctx.user ? `${ctx.user.nickName}(${ctx.user.alias})` : null,
    });
  }
}

// 私有日志类型
const PRIVATE_LOGGER: { name: string; options?: LoggerOptions }[] = [
  {
    name: 'REQUEST_ERROR', // 请求链路中间件调用
    options: {
      // LoggerOptions参数参考：https://www.yuque.com/midwayjs/midway_v2/logger#Egfbi
      fileLogName: 'request-error.log',
      printFormat: info => {
        // info取值参数参考：https://www.yuque.com/midwayjs/midway_v2/logger#OYRgn
        return (function (info) {
          const _baseInfo_ = [
            info.timestamp,
            info.LEVEL,
            info.pid,
            info.userInfo,
          ];
          return `[${_baseInfo_.filter(i => i).join('] [')}] ${
            info.labelText
          }[Request parameters] ${JSON.stringify(info.params)} ${info.message}`;
        })(info);
      },
    },
  },
];

// 注册自定义日志
const initCustomLogger = (
  container: MidwayContainer,
  app: IMidwayApplication
): void => {
  // 注册自定义日志
  [...PRIVATE_LOGGER, ...app.getConfig().loggerConfig].forEach(
    ({ name, options = {} }: { name: string; options?: LoggerOptions }) => {
      if (!(options.dir && options.dir.endsWith(pJson.name))) {
        options.dir = join(__dirname, `../../logs/${pJson.name}`);
      }
      app.createLogger(name, options);
    }
  );
};

export const initLogger = (
  container: MidwayContainer,
  app: IMidwayApplication
): void => {
  // 注册请求链路logger
  app.setContextLoggerClass(MidwayCustomContextLogger);
  // 注册自定义logger
  initCustomLogger(container, app);
};
