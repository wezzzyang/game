#!/bin/bash
###
 # @Author: FuGu
 # @Date: 2021-06-11 16:54:34
 # @LastEditors: FuGu
 # @LastEditTime: 2021-06-11 19:09:54
 # @email: fuxueshuang@fancguo.cn
 # @description: init核心工具
### 
source ./utils/bean.sh

# -------------------------------------------root用户------------------------------------------------
# docker 用户执行
function USER_DOCKER_INIT() {
    local _path_=${JENKINS_REMOTE_DIR}/${PROJECT_NAME}/publish/.bin
    su - docker -c "cd ${_path_} && /bin/bash -e docker.sh ${_ENV_}"
}

# 设置宿主机nginx
function SETUP_ROOT(){
    ECHO_FUN "开始配置NGINX" "宿主" "root"
	cat ${_middle_}/root.nginx.conf > ${HOST_NGINX_PATH}/${PROJECT_NAME}.nginx.conf
    ECHO_FUN "开始重启NGINX" "宿主" "root"
	nginx -s reload
}
