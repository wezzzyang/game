#!/bin/bash
###
# @Author: FuGu
# @Date: 2021-06-11 16:53:53
 # @LastEditors: 付汩
 # @LastEditTime: 2021-06-18 18:40:02
# @email: fuxueshuang@fancguo.cn
# @description: 内部配置文件
###

_ENV_=${1:-"beta"} # 环境变量，默认值beta
_middle_="./middle" # 生成中间件目录地址
_DOCKER_NGINX_PORT_=80; # 容器内nginx端口号
_DOCKER_IMAGE_="fxs0819/wp"; # 镜像名称
_DOCKER_WORKDIR_="/web" # 容器内项目的工作目录
_WEB_CONFIG_=() # 配置信息

_PARSE_WEB_CONFIG_=(VUE_APP_PREFIX BUILDER VIEW_DIR SERVER_DIR SERVER_PROT) # 解析WEB_CONFIG的顺序