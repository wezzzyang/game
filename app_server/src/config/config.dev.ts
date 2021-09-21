/*
 * @Descripttion: 开发环境配置文件
 * @version: 1.0.0
 * @Author: Adu
 * @Date: 2021-05-20 16:16:27
 * @LastEditors: 付汩
 * @LastEditTime: 2021-07-05 14:05:17
 */

import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
export type DefaultConfig = PowerPartial<EggAppConfig>;
import { RpcConfig } from '../lib/rpcDecorator';

// 项目唯一标识 package.json的name  + 环境 + 时间戳
export const projectName = `${process.env.npm_package_name}-dev_${Date.now()}`;

export const orm = {
  default: {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgre',
    database: 'mind-word',
    synchronize: false, // 是否同步表接口，生产环境需要关闭
    logging: false,
    timezone: '+08:00', // 时区
  },
};
export const fileSys = {
  host: 'yunpan.fancyguo.com',
  port: 80,
  useSSL: false,
  username: 'dev',
  password: 'Mvc!^m!uMj5s',
};
/*
Rpc客户端连接配置
连接js版本的uri后缀不需要添加/
连接TS版本的uri后缀需要添加/
*/
export const rpcClientConfig: Array<RpcConfig> = [
  {
    name: 'wpRpcServer',
    uri: 'http://127.0.0.1:8001/',
    timeout: 10000, // (非必填)超时时长，可不填写
  },
  // {
  //     name: 'selfRpcServer',
  //     uri: 'http://127.0.0.1:7001/', // (必填)连接地址，字符串或者数组
  //     timeout: 2000
  // }
];

export default (appInfo: EggAppInfo) => {
  const config = {} as DefaultConfig;
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

  return config;
};
