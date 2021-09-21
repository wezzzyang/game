#!/bin/bash
###
 # @Author: FuGu
 # @Date: 2021-06-11 16:54:54
 # @LastEditors: 付汩
 # @LastEditTime: 2021-06-22 11:34:20
 # @email: fuxueshuang@fancguo.cn
 # @description: 基础工具
### 

# 打印 32：绿， 37：白，36：天蓝
function ECHO_FUN() {
	local _CONTAN_=${2:-"宿主"} # 执行的容器：宿主||容器
	local _USER_=${3:-"root"} # 执行用户：root||docker
	echo -e "\e[36m [${_CONTAN_}]>>>>>>>>>[${_USER_}]---------------------------------------------------------$1 \e[0m"
}

# 解析配置方法
function PARSE_CONFIG_FUN() {
	# $1:提示信息
	# $2:输入
	# $3:输出
	ECHO_FUN "${1}" "宿主" "docker"
	local content=$(cat ${2})
	eval "cat <<EOF
$content
EOF"  > $3
}
