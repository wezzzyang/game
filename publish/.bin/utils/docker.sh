#!/bin/bash
###
 # @Author: FuGu
 # @Date: 2021-06-11 16:54:34
 # @LastEditors: 付汩
 # @LastEditTime: 2021-07-01 17:40:26
 # @email: fuxueshuang@fancguo.cn
 # @description: 核心工具
### 
source ./utils/bean.sh

# ---------------------------------------------------------------docker用户--------------------------------------------------------------------
# 解析WEB_CONFIG参数
function PARSE_WEB_CONFIG_FUN() {
	local ITEM
	for ITEM in "${WEB_CONFIG[@]}" ; do
		declare -A _MIDDLE_
		local _MIDDLE_=()
		local _MIDDLE2_=()
		ITEM=($ITEM)
		for i in "${ITEM[@]}"; do
			key=`echo $i|awk -F'=' '{print $1}'`
			value=`echo $i|awk -F'=' '{print $2}'`
			_MIDDLE_+=([$key]=$value)
		done
		for key in "${_PARSE_WEB_CONFIG_[@]}"; do
			_MIDDLE2_[${#_MIDDLE2_[*]}]=${_MIDDLE_[${key}]:-"null"}
		done
        _WEB_CONFIG_[${#_WEB_CONFIG_[*]}]=${_MIDDLE2_[@]}
	done
}

# 解析配置
function PARSE_CONFIG() {
	if [ ! -d ${_middle_} ]; then
		mkdir ${_middle_}
	fi
	# 解析WEB_CONFIG
	PARSE_WEB_CONFIG_FUN
	# 解析宿主机器nginx配置
	local _CONFIG_
	rm -rf ./${_middle_}/root.nginx.conf
	if [ "${IS_CUSTOM_ROOT_NGINX}" = "true" ];
	then
		cat ../template/root_${_ENV_}.nginx.conf > ./${_middle_}/root.nginx.conf
	else
		for _CONFIG_ in "${_WEB_CONFIG_[@]}" ; do
			_CONFIG_=(${_CONFIG_})
			local _VUE_APP_PREFIX_=${_CONFIG_[0]}
			local _SERVER_DIR_=${_CONFIG_[3]}
			eval "cat <<EOF
$(cat ./template/root.nginx.conf)
EOF" >> ./${_middle_}/root.nginx.conf
		done

	fi


	# 解析docker-compose.yml配置
	PARSE_CONFIG_FUN "开始解析docker-compose.yml配置" ../template/docker-compose.yml ./${_middle_}/docker-compose.yml

	# 解析容器nginx
	ECHO_FUN "开始解析容器NGINX配置" "宿主" "docker"
	cat ../template/${_ENV_}.nginx.conf > ./${_middle_}/container.nginx.conf
}

# 初始化容器
function SETUP_CONTAINER() {
	ECHO_FUN "开始初始化容器" "宿主" "docker"
	local exist
	{
		exist=`docker inspect --format '{{.State.Running}}' ${DOCKER_CONTAINER_NAME}`
	} || {
		exist=false
	}
	if [ "${exist}" = "true" ];
	then
		# 容器存在则停掉
		ECHO_FUN "开始停止${DOCKER_CONTAINER_NAME}容器" "宿主" "docker"
		docker stop $DOCKER_CONTAINER_NAME
	fi
	{
		ECHO_FUN "开始移除${DOCKER_CONTAINER_NAME}容器" "宿主" "docker"
		docker rm $DOCKER_CONTAINER_NAME
	} || true
	ECHO_FUN "开始构建${DOCKER_CONTAINER_NAME}容器" "宿主" "docker"
    docker-compose -f $JENKINS_REMOTE_DIR/$PROJECT_NAME/publish/.bin/${_middle_}/docker-compose.yml up -d
}

# 设置docker
function SETUP_DOCKER(){
	local _CONTAN_="容器" # 执行的容器：宿主||容器
	local _USER_="dockerRoot"
	local _SHELL_="" # 业务执行的shell脚本
	local _SERVER_DIRS_=()
	# 解析配置（前端）
	for _CONFIG_ in "${_WEB_CONFIG_[@]}" ; do
		_CONFIG_=(${_CONFIG_})
		local _BUILDER_=${_CONFIG_[1]}
		local _VIEW_DIR_=${_CONFIG_[2]}
		_SERVER_DIRS_+=(${_CONFIG_[3]})
		if [ "${_BUILDER_}" = "yarn" ];
		then
			_SHELL_+="
				echo -e '\e[36m [${_CONTAN_}]>>>>>>>>>[${_USER_}]---------------------------------------------------------开始下载前端依赖并编译，path：${_VIEW_DIR_} \e[0m';
				cd ${_DOCKER_WORKDIR_}/${_VIEW_DIR_} && yarn install && yarn ${_ENV_};
			"
		else
			_SHELL_+="
				echo -e '\e[36m [${_CONTAN_}]>>>>>>>>>[${_USER_}]---------------------------------------------------------开始下载前端依赖并编译，path：${_VIEW_DIR_} \e[0m';
				cd ${_DOCKER_WORKDIR_}/${_VIEW_DIR_} && cnpm install && cnpm run ${_ENV_};
			"
		fi
	done
	# 解析配置（后端）
	_SERVER_DIRS_=($(echo ${_SERVER_DIRS_[*]} | sed 's/ /\n/g' | sort | uniq)) # 去重
	for _SERVER_DIR_ in "${_SERVER_DIRS_[@]}" ; do
		_SHELL_+="
			echo -e '\e[36m [${_CONTAN_}]>>>>>>>>>[${_USER_}]---------------------------------------------------------开始下载后端依赖并启动，path：${_SERVER_DIR_} \e[0m';
			cd ${_DOCKER_WORKDIR_}/${_SERVER_DIR_} && cnpm install;
			echo -e '\e[36m [${_CONTAN_}]>>>>>>>>>[${_USER_}]---------------------------------------------------------开始启动后端服务，path：${_SERVER_DIR_}，ENV：${_ENV_} \e[0m';
			cnpm run ${_ENV_};
		"
	done
	# 更新容器
	docker exec ${DOCKER_CONTAINER_NAME} /bin/bash -ce "
		source ~/.nvm/nvm.sh;
		echo -e '\e[36m [${_CONTAN_}]>>>>>>>>>[${_USER_}]---------------------------------------------------------开始安装node v${NODE_VERSION} \e[0m';
		nvm install ${NODE_VERSION};
		echo -e '\e[36m [${_CONTAN_}]>>>>>>>>>[${_USER_}]---------------------------------------------------------开始安装cnpm \e[0m';
		npm install -g cnpm --registry=https://registry.npm.taobao.org;
		echo -e '\e[36m [${_CONTAN_}]>>>>>>>>>[${_USER_}]---------------------------------------------------------开始安装yarn \e[0m';
		cnpm install -g yarn;
		echo -e '\e[36m [${_CONTAN_}]>>>>>>>>>[${_USER_}]---------------------------------------------------------开始安装pm2 \e[0m';
		cnpm install -g pm2;
		${_SHELL_}
		echo -e '\e[36m [${_CONTAN_}]>>>>>>>>>[${_USER_}]---------------------------------------------------------开始配置NGINX \e[0m';
		cat ${_DOCKER_WORKDIR_}/publish/.bin/${_middle_}/container.nginx.conf > /etc/nginx/conf.d/default.conf;
		echo -e '\e[36m [${_CONTAN_}]>>>>>>>>>[${_USER_}]---------------------------------------------------------开始重启NGINX \e[0m';
		nginx -s reload;
		mv /etc/localtime /etc/localtime.bak;
		ln -s /usr/share/zoneinfo/Asia/Shanghai  /etc/localtime;
	"
}
