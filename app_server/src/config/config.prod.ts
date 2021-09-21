/*
 * @Descripttion: 线上配置文件
 * @version: 1.0.0
 * @Author: Adu
 * @Date: 2021-05-20 16:16:27
 * @LastEditors: 付汩
 * @LastEditTime: 2021-07-05 14:06:40
 */
import { RpcConfig } from '../lib/rpcDecorator';
import { DefaultConfig as PrometheusDefaultConfig } from '@midwayjs/prometheus';

// 项目唯一标识
export const projectName = `${process.env.npm_package_name}-prod_${Date.now()}`;

export const dbConfig = {
  user: 'prod',
  password: 'prod',
};

export const fileSys = {
  host: 'yunpan.fancyguo.com',
  port: 80,
  useSSL: false,
  username: 'prod',
  password: 'PzIa7P3vK!vd',
};

export const rpcConfig: Array<RpcConfig> = [];

/**
 * 在RPC支持header设置之前，该功能先关闭
 */
export const security = {
  csrf: {
    // 线上环境需要开启
    enable: false, // 默认开启防止 XSS 攻击 和 CSRF 攻击，不建议关闭
    ignore: ctx => ctx.ip, // ip白名单设置
    headerName: 'm-t-k', // 设置携带的header名称
  },
};

// 监控系统
export const prometheus: PrometheusDefaultConfig = {
  labels: {
    APP_NAME: projectName,
  },
};
