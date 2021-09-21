# 还未添加
    1. 可插拔数据库（typeOrm） postgre/mongo/redis/rabbitMQ （付汩）
    2. 性能监控（付汩）
    3. docker部署（付汩）
    4. 文件上传下载（付汩）
    5. rpc相关，最终使用：hprose，且需要封装一个装饰器（啊杜）
    6. 异常拦截器（付汩）
    7. 全局日志（付汩）
    8. JWT
    9. 跨域 CORS
    10. 本地缓存
    11. redis缓存
    12. MongoDB
    13. 请求封装
    
备注： 需要更改package.json文件中name属性
# my-midway-project



### 环境变量值
| 值 | 说明 |
|  ----  | ----  |
|  dev  | 本地开发环境  |
|  beta  | 预生成环境  |
|  prod  | 生产环境  |

默认日志名
Midway 对 EggJS 默认的日志文件名做了修改。
• midway-core.log 框架输入日志
• midway-web.log 应用输出日志
• midway-agent.log agent 中输出的日志
• common-error.log 统一的错误输出日志

### Development

```bash
$ yarn install
$ yarn dev
$ open http://localhost:7001/
```


### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.


[midway]: https://midwayjs.org
