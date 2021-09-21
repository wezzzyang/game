#!/bin/bash
###
# @Author: FuGu
# @Date: 2021-06-11 16:53:53
 # @LastEditors: FuGu
 # @LastEditTime: 2021-06-11 18:41:30
# @email: fuxueshuang@fancguo.cn
# @description: 入口文件（启动：bash -e ./init.sh）
###

source ../config.sh # 加载配置
source ./config/index.sh
source ./utils/init.sh

function main() {
	echo -e "\e[32m ---------------------------- START ---------------------------- \e[0m"
	USER_DOCKER_INIT # docker用户执行
	SETUP_ROOT # 设置宿主机
	echo -e "\e[32m ------------------------- END SUCCESS ------------------------- \e[0m"
}

main
