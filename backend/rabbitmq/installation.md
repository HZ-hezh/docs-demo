# RabbitMQ 安装与配置

本文介绍如何在不同操作系统上安装和配置 RabbitMQ。

## 系统要求

- Erlang/OTP 24.0 或更高版本
- 足够的内存和磁盘空间

## Windows 安装

### 1. 安装 Erlang

首先需要安装 Erlang 运行环境：

1. 访问 [Erlang官网](https://www.erlang.org/downloads) 下载最新版本
2. 运行安装程序并完成安装
3. 配置环境变量

### 2. 安装 RabbitMQ

1. 访问 [RabbitMQ官网](https://www.rabbitmq.com/download.html) 下载Windows版本
2. 运行安装程序
3. 启动 RabbitMQ 服务

## Linux 安装

### Ubuntu/Debian

```bash
# 更新包列表
sudo apt-get update

# 安装 RabbitMQ
sudo apt-get install rabbitmq-server

# 启动服务
sudo systemctl start rabbitmq-server
sudo systemctl enable rabbitmq-server
```

### CentOS/RHEL

```bash
# 安装 EPEL 仓库
sudo yum install epel-release

# 安装 RabbitMQ
sudo yum install rabbitmq-server

# 启动服务
sudo systemctl start rabbitmq-server
sudo systemctl enable rabbitmq-server
```

## Docker 安装

使用 Docker 是最简单的安装方式：

```bash
# 运行 RabbitMQ 容器（包含管理界面）
docker run -d --name rabbitmq \
  -p 5672:5672 \
  -p 15672:15672 \
  rabbitmq:3-management

# 查看容器状态
docker ps
```

## 验证安装

安装完成后，可以通过以下方式验证：

1. **命令行验证**：
   ```bash
   rabbitmqctl status
   ```

2. **Web管理界面**：
   - 访问 http://localhost:15672
   - 默认用户名/密码：guest/guest

## 基础配置

### 启用管理插件

```bash
sudo rabbitmq-plugins enable rabbitmq_management
```

### 创建用户

```bash
# 创建新用户
sudo rabbitmqctl add_user admin password123

# 设置用户角色
sudo rabbitmqctl set_user_tags admin administrator

# 设置权限
sudo rabbitmqctl set_permissions -p / admin ".*" ".*" ".*"
```

安装完成后，你就可以开始使用 RabbitMQ 了！