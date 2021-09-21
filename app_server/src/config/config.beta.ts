/*
 * @Descripttion: 测试环境配置文件
 * @version: 1.0.0
 * @Author: Adu
 * @Date: 2021-05-20 16:16:27
 * @LastEditors: 付汩
 * @LastEditTime: 2021-07-05 14:06:14
 */

import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
export type DefaultConfig = PowerPartial<EggAppConfig>;
import { RpcConfig } from '../lib/rpcDecorator';

export const projectName = `${process.env.npm_package_name}-beta_${Date.now()}`;

export const dbConfig = {
  user: '1',
  password: '1',
};

export const fileSys = {
  host: 'yunpan.fancyguo.com',
  port: 80,
  useSSL: false,
  username: 'beta',
  password: 'fTTA&HfkH4FD',
};
export const rpcConfig: Array<RpcConfig> = [];

export default (appInfo: EggAppInfo) => {
  const config = {} as DefaultConfig;
  config.security = {
    // csrf: {
    //   enable: false
    // },
    csrf: {
      // 线上环境需要开启
      enable: true, // 默认开启防止 XSS 攻击 和 CSRF 攻击，不建议关闭
      // ignore: ctx => ctx.ip, // ip白名单设置
      headerName: 'm-t-k', // 设置携带的header名称
    },
  };

  return config;
};
