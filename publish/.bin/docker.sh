#!/bin/bash
###
# @Author: FuGu
# @Date: 2021-06-11 16:53:53
 # @LastEditors: 付汩
 # @LastEditTime: 2021-06-22 11:55:50
# @email: fuxueshuang@fancguo.cn
# @description: docker用户执行的脚本
###

source ../config.sh # 加载配置
source ./config/index.sh
source ./utils/docker.sh

function main() {
    ECHO_FUN "START" "宿主" "docker"
    PARSE_CONFIG # 解析配置
    SETUP_CONTAINER # 初始化容器
    SETUP_DOCKER # 设置docker
    ECHO_FUN "END" "宿主" "docker"
}

main
