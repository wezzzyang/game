/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: Adu
 * @Date: 2021-05-20 16:16:27
 * @LastEditors: Adu
 * @LastEditTime: 2021-06-10 17:09:31
 */
import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
import { LoggerOptions } from '@midwayjs/logger';

export type DefaultConfig = PowerPartial<EggAppConfig>;

export default (appInfo: EggAppInfo) => {
  const config = {} as DefaultConfig;
  // midway需要的唯一标识
  config.keys = `${appInfo.name}_${Date.now()}`;
  // 全局路由中间件（拦截器）
  config.middleware = [
    'requestErrorrMiddleware',
    'globalMiddleware',
    'rpcMiddleware',
  ];
  // 解决日志问题
  config.midwayFeature = {
    // true 代表使用 midway logger
    // false 或者为空代表使用 egg-logger
    replaceEggLogger: true,
  };
  // 解决文件上传问题
  config.multipart = {
    mode: 'file',
  };
  // 解决API文档问题
  config.swagger = {
    title: `${appInfo.name}项目API`,
    description: 'swagger-ui for midway api详情描述',
    version: '1.0.0',
    termsOfService: '',
    routerMap: false, // 禁止自动注册路由, 否则会找不到注入对象
  };
  // 解决跨域问题
  config.security = {
    csrf: {
      enable: false, // 默认开启防止 XSS 攻击 和 CSRF 攻击，不建议关闭
      ignoreJSON: true,
      ignore: true,
    },
  };
  config.cors = {
    origin: '*',
    allowHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Access-Control-Allow-Origin',
      'm-t-k',
      '*',
    ],
    allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
  };

  // 日志配置 LoggerOptions参数参考：https://www.yuque.com/midwayjs/midway_v2/logger#EgfbiW
  config.loggerConfig = [
    {
      name: 'example', // 自定义logger的key
    },
  ] as { name: string; options?: LoggerOptions }[];

  config.multipart = {
    mode: 'file',
    fileExtensions: ['.xlsx', '.xlx', '.txt'], // 增加扩展名的文件支持
  };
  return config;
};
