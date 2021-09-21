# ---------------------------------------------必传---------------------------------------------------
###
 # @Author: 付汩
 # @Date: 2021-06-22 11:27:37
 # @LastEditors: 柳惊鸿
 # @LastEditTime: 2021-08-07 18:21:27
 # @email: fuxueshuang@fancyguo.cn
### 
# jenkins配置
JENKINS_REMOTE_DIR="/jenkins_web"; # jenkins：系统管理->系统配置->RemoteDirectory

# host宿主机
HOST_NGINX_PATH="/etc/nginx/conf.d/micro.d"; # 宿主机nginx地址

# docker配置
DOCKER_CONTAINER_NAME="app_mind_word"; # 容器名称(唯一)
DOCKER_EXPORT_PORT=6888; # 宿主机映射端口号（项目之间不可重复）

# 项目部署配置
PROJECT_NAME="app_mind_word"; # 项目名称（不可重复）jenkins：项目->配置->构建->RemoteDirectory(无反斜杠或斜杠)
NODE_VERSION=12.22.1; # 项目依赖的node版本

# 项目配置【shell数组格式 WEB_CONFIG=("conf1..." "conf2..." ...)】
#    VUE_APP_PREFIX：项目前缀，选传：IS_CUSTOM_ROOT_NGINX=true时可不传
#    BUILDER：前端编译方式
#    VIEW_DIR：前端地址（基于项目根目录）
#    SERVER_DIR：后端地址（基于项目根目录）
#    SERVER_PROT：后端服务端口号
WEB_CONFIG=(
    "
        VUE_APP_PREFIX=app_mind_word
        BUILDER=yarn
        VIEW_DIR=app_view
        SERVER_DIR=app_server
        SERVER_PROT=app_mind_word
    "
)
# ---------------------------------------------------------------------------------------------------
IS_CUSTOM_ROOT_NGINX=true; # 是否自主生成宿主机器的nginx，默认false采用自动配置