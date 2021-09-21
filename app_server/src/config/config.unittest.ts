/*
 * @Descripttion:
 * @version: 1.0.0
 * @Author: Adu
 * @Date: 2021-05-20 16:16:27
 * @LastEditors: Adu
 * @LastEditTime: 2021-06-10 18:10:54
 */

import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
export type DefaultConfig = PowerPartial<EggAppConfig>;

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
