/*
 * @Descripttion: RPC针对midway框架封装，目前发布订阅功能官方已声明存在BUG，待官方修复后再开放
 * @version: 1.0.0
 * @Author: Adu
 * @Date: 2021-05-24 17:47:23
 * @LastEditors: Adu
 * @LastEditTime: 2021-06-22 17:28:58
 */
/* eslint-disable no-new prettier/prettier */
import {
  Service,
  ServiceContext,
  NextInvokeHandler,
  Client,
  Method,
} from '@hprose/rpc-core';
import { Broker, Prosumer } from '@hprose/rpc-plugin-push';
import '@hprose/rpc-node';
import {
  saveModule,
  listModule,
  savePropertyDataToClass,
  listPropertyDataFromClass,
} from '@midwayjs/decorator';
import { MidwayContainer, IMidwayApplication } from '@midwayjs/core';
import { Context as EggContext } from 'egg';
/**
 * 定义反射用的常量
 */
const CLASS_KEY = 'rpc:hprose:class'; // RPC的类标识
const RPC_KEY = 'rpc:hprose:function'; // 暴露出去的rpc方法标识
const PUBLISH_KEY = 'rpc:hprose:function:publish'; // 发布
const SUBSCRIBE_KEY = 'rpc:hprose:function:subscribe'; // 订阅
const MIDDLEWARE_CLASS_KEY = 'rpc:hprose:middleware:class'; // 中间件的类标识
const MIDDLEWARE_SERVER_KEY = 'rpc:hprose:middleware:server'; // 服务端中间件标识
const MIDDLEWARE_CLIENT_KEY = 'rpc:hprose:middleware:client'; // 客户端中间件标识
// 客户端连接对象
const _clientAll = new Map();
/*
 * 暴露原始RPC服务端对象
 */
export let broker: Broker;
export let service: Service;

/**
 * 定义基础类型
 */
export declare type RpcContext = ServiceContext;
export declare type RpcNextInvokeHandler = NextInvokeHandler;

/**
 * 配置rpc所需参数
 */
export interface RpcConfig {
  name: string; // 连接对象名称，IOC名称
  uri: string | string[]; // (必填)连接地址，字符串或者数组
  timeout: number; // (非必填)超时时长，可不填写
}

/**
 * RPC类信息收集器
 */
export const RpcController = (): ClassDecorator => {
  return (target: any) => {
    saveModule(CLASS_KEY, target);
  };
};

/**
 * 暴露方法收集器
 * @param alias 自定义暴露方法的名称
 */
export const Rpc =
  (alias?: string): MethodDecorator =>
  (target: object, key: string, descriptor: PropertyDescriptor) => {
    savePropertyDataToClass(
      RPC_KEY,
      { method: descriptor.value, key: alias || key },
      target,
      key
    );
  };

/**
 * 暴露方法收集器
 * @param topic 自定义暴露方法的名称
 * @param ids 自定义暴露方法的名称
 */

export const RpcPublish = (
  topic: string,
  id?: string | string[]
): MethodDecorator => {
  return (target: object, key: string, descriptor: PropertyDescriptor) => {
    const thisFactory = {
      proxy: () => {},
    };
    savePropertyDataToClass(
      PUBLISH_KEY,
      { key, descriptor, topic, id, thisFactory },
      target,
      key
    );
    const fn = descriptor.value;
    descriptor.value = async function transfersFunction() {
      let _this = thisFactory.proxy();
      let value = await fn.apply(_this, arguments);
      console.log('发送broker.push');
      let result = await broker.push(value, topic, id);
      console.log('结束broker.push：', result);
      // TODO：日志
    };
  };
};

/**
 * 暴露方法收集器
 * @param serverName 订阅RPC服务的名称
 * @param alias 自定义暴露方法的名称
 */
// TODO 【RPC】订阅功能待修复后开放
export const RpcSubscribe =
  (serverName: string, topic: string): MethodDecorator =>
  (target: object, key: string, descriptor: PropertyDescriptor) => {
    // 客户端唯一标识
    savePropertyDataToClass(
      SUBSCRIBE_KEY,
      { serverName, method: descriptor.value, topic },
      target,
      key
    );
  };

/**
 * RPC中间件类收集器
 */
export const RpcMiddlewareClass = (): ClassDecorator => {
  return (target: any) => {
    saveModule(MIDDLEWARE_CLASS_KEY, target);
  };
};

/**
 * 在有RPC请求访问是会进入该方法
 * @param order 优先级，值越大越先加载，默认为0，默认情况下按照加载顺序走
 */
export const RpcMiddlewareServer = (order?: number): MethodDecorator => {
  return (target: object, key: string, descriptor: PropertyDescriptor) => {
    savePropertyDataToClass(
      MIDDLEWARE_SERVER_KEY,
      { method: descriptor.value, order: order || 1 },
      target,
      key
    );
  };
};

/**
 * RPC客户端发送请求时的中间件
 * @param clientName 连接
 * @param order 优先级，值越大越先加载，默认为0，默认情况下按照加载顺序走
 * @returns
 */
export const RpcMiddlewareClient = (
  clientName: string,
  order?: number
): MethodDecorator => {
  return (target: object, key: string, descriptor: PropertyDescriptor) => {
    savePropertyDataToClass(
      MIDDLEWARE_CLIENT_KEY,
      { method: descriptor.value, clientName, order },
      target,
      key
    );
  };
};

/**
 * 根据midway的请求 + 是否注册了rpc 来判断是否处理
 * @param ctx 所属框架的ctx对象
 * @returns
 */
export const isRpcRequest = (ctx: EggContext) => {
  return (
    ctx.request.method === 'POST' &&
    ctx.request.url === '/' &&
    ctx.req.headers.hasOwnProperty('content-length') &&
    service
  );
};

/**
 * rpc方法注册
 * @param container
 * @param service
 * @returns 返回是否成功注册方法
 */
async function loadRpcFun(container: MidwayContainer, service: Service) {
  let isNotLoadService = true;
  let isNotLoadBroker = true;
  const modules = listModule(CLASS_KEY);
  for (let mod of modules) {
    const target = await container.getAsync(mod);
    listPropertyDataFromClass(RPC_KEY, mod).forEach(item => {
      let serviceMethod = new Method(item.method, item.key, target);
      serviceMethod.passContext = true;
      service.add(serviceMethod);
      isNotLoadService && (isNotLoadService = false);
    });
    listPropertyDataFromClass(PUBLISH_KEY, mod).forEach(item => {
      item.thisFactory.proxy = () => target;
      isNotLoadBroker && (isNotLoadBroker = false);
    });
  }
  return { isNotLoadService, isNotLoadBroker };
}

/**
 * @description: 处理服务端注册事件
 * @param container
 * @returns
 */
async function handleServer(container: MidwayContainer) {
  broker = new Broker(new Service());
  service = broker.service;
  // service = new Service()
  let { isNotLoadService, isNotLoadBroker } = await loadRpcFun(
    container,
    service
  );
  // 判断
  if (isNotLoadService) {
    console.log('【RPC】未找到暴露方法，已注销service');
    service = undefined;
    if (isNotLoadBroker) {
      console.log('【RPC】未找到推送方法，已注销broker');
      broker = undefined;
    }
    return;
  }
  // 加载服务段中间件
  listModule(MIDDLEWARE_CLASS_KEY).forEach(mod => {
    listPropertyDataFromClass(MIDDLEWARE_SERVER_KEY, mod)
      .sort((a, b) => b.order - a.order)
      .forEach(item => service.use(item.method));
  });
}

/**
 * @description: 返回原始客户端连接对象
 * @param name 客户端注册名称
 * @returns
 */
export const getClientSource = (name: string): Client => {
  return _clientAll.get(name);
};

/**
 * @description: 客户端连接处理
 * @param {MidwayContainer} container
 * @param {IMidwayApplication} app
 * @return {*}
 */
async function handleClient(
  container: MidwayContainer,
  app: IMidwayApplication
) {
  let rpcClientConfig: Array<RpcConfig> = app.getConfig().rpcClientConfig;
  if (!rpcClientConfig) {
    console.error(`无rpc连接相关配置`);
    return;
  }
  for (let config of rpcClientConfig) {
    if (!(config.uri && config.uri.length && config.name)) {
      console.error(`因uri参数为空，注册失败，配置：${config}`);
      break;
    }
    const client = new Client(config.uri);
    client.timeout = config.timeout || 0;
    let proxy = client.useService<any>();
    client.use(async function clientMiddleware(
      fullname: string,
      args: any[],
      context: RpcContext,
      next: RpcNextInvokeHandler
    ): Promise<any> {
      // TODO 错误记录
      context.requestHeaders['m-t-k'] = context.requestHeaders.id;
      return await next(fullname, args, context);
    });
    // 加载客户端中间件
    listModule(MIDDLEWARE_CLASS_KEY).forEach(mod => {
      listPropertyDataFromClass(MIDDLEWARE_CLIENT_KEY, mod)
        .filter(item => item.clientName === config.name)
        .sort((a, b) => b.order - a.order)
        .forEach(item => client.use(item.method));
    });
    // 注入Ioc
    app.getApplicationContext().registerObject(config.name, proxy);
    _clientAll.set(config.name, client);
    // 加载客户端订阅模式
    await handleProsumer(container, app, config, client);
  }
}

/**
 * @description: 客户端订阅处理方法，该方法会导致客户端不可用，待官方修复后，再使用
 * @param {MidwayContainer} container
 * @param {IMidwayApplication} app
 * @param {string} clientName 客户端的连接名称
 * @param {Client} client 客户端对象
 * @return {*}
 */
export async function handleProsumer(
  container: MidwayContainer,
  app: IMidwayApplication,
  config: RpcConfig,
  client: Client
) {
  let projectName: string = app.getConfig().projectName;
  let prosumer = new Prosumer(client, projectName);
  const modules = listModule(CLASS_KEY);
  let isNotloadPros = true;
  for (let mod of modules) {
    const target = await container.getAsync(mod);
    listPropertyDataFromClass(SUBSCRIBE_KEY, mod)
      .filter(item => item.serverName === config.name)
      .forEach(item => {
        prosumer.subscribe(item.topic, async message => {
          console.log('接受监听');
          item.method.call(target, message?.data);
        });
        console.log('item', item);
        !isNotloadPros || (isNotloadPros = false);
      });
  }
  prosumer.onerror = err => {
    // 心跳错误，忽略
    if (err.message === 'timeout') {
      return;
    }
    console.log(`[报错] ${config.uri}, ${config.name}`, err.message);
  };
  prosumer.onsubscribe = topic => {
    console.log(`[成功订阅] ${config.uri}, ${topic}`);
  };
  prosumer.onunsubscribe = topic => {
    console.log(`[取消订阅] ${config.uri}, ${topic}`);
  };
  console.log('isNotloadPros: ', isNotloadPros);
  if (isNotloadPros) {
    prosumer = null;
  }
}

/**
 * 初始化RPC方法
 * @param container 容器对象，获取ioc中对象
 * @param app 应用对象，向ioc中注入对象
 * @returns
 */
export const initRpc = async (
  container: MidwayContainer,
  app: IMidwayApplication
) => {
  await handleServer(container);
  await handleClient(container, app);
};
