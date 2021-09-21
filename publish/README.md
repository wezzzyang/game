### 部署脚本
前述：
   自动化部署
    
### 项目目录说明
&emsp;[config.sh 【项目部署配置文件】](./config.sh) <br>
&emsp;[template 【模板文件】](./template)<br>
&emsp;|-- [beta.nginx.conf 【测试环境NGINX配置（容器内）】](./template/beta.nginx.conf)<br>
&emsp;|-- [prod.nginx.conf 【生产环境NGINX配置（容器内）】](./template/prod.nginx.conf)<br>
&emsp;|-- [root_beta.nginx.conf 【测试环境NGINX配置（宿主机）】](./template/beta.nginx.conf)<br>
&emsp;|-- [root_prod.nginx.conf 【生产环境NGINX配置（宿主机）】](./template/prod.nginx.conf)<br>
&emsp;|-- [docker-compose.yml 【yml文件】](./template/docker-compose.yml)<br>

---

### 配置项目前缀（1/3）

#### 1、设置变量
```
# 环境变量文件
VUE_APP_PREFIX = '你的项目前缀'
```

#### 2、设置静态资源前缀
```
# vue.config.js
publicPath: process.env.VUE_APP_PREFIX ? `/${process.env.VUE_APP_PREFIX}` : '/',
```

#### 3、设置路由前缀
```
# router/index.js
const createRouter = () => new Router({
  mode: 'history',
  routes: constantRoutes,
  base: process.env.VUE_APP_PREFIX ? `/${process.env.VUE_APP_PREFIX}/` : '',
  scrollBehavior: () => ({ y: 0 })
});
```

#### 4、设置请求前缀
```
# request.js
const currentPath = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
let baseURL = '';
if (currentPath) {
  let rexArr = currentPath.match(/^http(s|):\/\/\S*?\//);
  baseURL = rexArr.length ? rexArr[0].slice(0, -1) : '';
}
const service = axios.create({
  baseURL: baseURL
    + (process.env.VUE_APP_PREFIX?`/${process.env.VUE_APP_PREFIX}`:'')
    + '/api',
  timeout: 50000 // request timeout
});
```


### 配置项目（2/3）

#### 1、准备
1、在你已完成“jenkins”配置和“配置项目前缀”后，你将获得一些参数：

```
VUE_APP_PREFIX # 项目前缀(无反斜杠或斜杠)
JENKINS_REMOTE_DIR # jenkins：系统管理->系统配置->RemoteDirectory
PROJECT_NAME # jenkins：项目->配置->构建->RemoteDirectory(无反斜杠或斜杠)
```
2、你已经熟悉线上项目nginx部署原理（因为在一些特殊情况下你需要自主编写nginx模板已达到你的需求）

#### 2、编写配置

```
# ./config.sh文件（部分配置1中已准备好）
HOST_NGINX_PATH="/etc/nginx/conf.d/micro.d"; # 宿主机存放的nginx地址（此为子系统）
DOCKER_CONTAINER_NAME="pack"; # 容器名称(唯一)
NODE_VERSION=12.22.1; # 项目依赖的node版本
IS_CUSTOM_ROOT_NGINX=true; # 是否自主生成宿主机器的nginx，默认false采用自动配置
DOCKER_EXPORT_PORT=9002; # 宿主机映射端口号（项目之间不可重复）,可不传只有docker-compose.yml用到

# 项目配置【shell数组格式 WEB_CONFIG=("conf1..." "conf2...")】
#    VUE_APP_PREFIX：项目前缀，选传：IS_CUSTOM_ROOT_NGINX=true时可不传
#    BUILDER：前端编译方式
#    VIEW_DIR：前端地址（基于项目根目录）
#    SERVER_DIR：后端地址（基于项目根目录）
#    SERVER_PROT：后端服务端口号
WEB_CONFIG=(
    "
        VUE_APP_PREFIX=wp_app_pack_out_pc
        BUILDER=cnpm
        VIEW_DIR=view
        SERVER_DIR=server
        SERVER_PROT=8631
    "
    ...多项自主添加其他服务
)
```

#### 3、编写模板
###### 例如你的VUE_APP_PREFIX="wp_app_pack_out"

```
# ./template/beta.nginx.conf && ./template/prod.nginx.conf (容器内nginx配置)
location /wp_app_pack_out/ {
    add_header Cache-Control "no-cache, no-store";
    add_header Cache-Control private;
    add_header Pragma no-cache;

    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods 'GET, POST, DELETE, PUT';
    add_header Access-Control-Allow-Headers 'Content-Type, Authorization, Accept, permission-header, fancy-guo-login-token';
    
	alias /web/view/dist/;
    index  index.html index.htm;
    try_files $uri $uri/ /wp_app_pack_out/index.html;
    error_page 404 /index.html;
}

location /wp_app_pack_out/api {
    proxy_pass   http://127.0.0.1:8631/api;
}

... 多项自主添加其他服务
```

```
# ./template/root_${env}.nginx.conf (宿主机器nginx配置), IS_CUSTOM_ROOT_NGINX=true时可采用此配置
server {
    listen 80;
    server_name beta.kg.fancyguo.com;

    proxy_set_header X-Forwarded-Host $host;
    proxy_set_header X-Forwarded-Server $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $host:$server_port; #这里是重点,这样配置才不会丢失端口

    location /wp_app_pack_out/ {
        proxy_pass   http://127.0.0.1:9002;
    }

    location /wp_app_pack_out/logs {
        alias   /jenkins_web/wp_app_pack_out/server/logs;
        autoindex on;
    }
}


... 多项自主添加其他服务
```


### Jenkins构建指令（3/3）

```
# 模板字符串如下：
chown docker -R ${JENKINS_REMOTE_DIR}/${PROJECT_NAME} || true &&
cd ${JENKINS_REMOTE_DIR}/${PROJECT_NAME}/publish/.bin ${ENV} &&
bash -e init.sh
```
例如：

```
chown docker -R /jenkins_web/kgm_base || true &&
cd /jenkins_web/kgm_base/publish/.bin beta &&
bash -e init.sh
```