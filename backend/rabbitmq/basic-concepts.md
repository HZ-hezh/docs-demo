# RabbitMQ 基础概念

在开始使用 RabbitMQ 之前，了解其核心概念是非常重要的。

## 消息队列模型

RabbitMQ 实现了 AMQP（Advanced Message Queuing Protocol）协议，采用以下基本模型：

```
Producer → Exchange → Queue → Consumer
```

## 核心组件

### Producer（生产者）
- 发送消息的应用程序
- 生产者创建消息并发布到交换机
- 不直接向队列发送消息

### Consumer（消费者）
- 接收并处理消息的应用程序
- 从队列中获取消息
- 可以有多个消费者处理同一个队列

### Queue（队列）
- 存储消息的缓冲区
- 消息的实际存储位置
- 具有FIFO（先进先出）特性

### Exchange（交换机）
- 接收生产者的消息并路由到队列
- 根据路由规则决定消息去向
- 不存储消息，只负责路由

### Binding（绑定）
- 连接交换机和队列的规则
- 定义了消息如何从交换机路由到队列

### Routing Key（路由键）
- 消息的路由标识
- 交换机根据路由键决定消息路由

## 交换机类型

### 1. Direct Exchange（直接交换机）
- 根据完全匹配的路由键进行路由
- 一对一的精确匹配

```
路由键: "user.create" → 只路由到绑定了 "user.create" 的队列
```

### 2. Fanout Exchange（扇出交换机）
- 忽略路由键，广播到所有绑定的队列
- 适用于广播消息

```
消息 → 所有绑定的队列都会收到
```

### 3. Topic Exchange（主题交换机）
- 支持通配符的路由键匹配
- `*` 匹配一个单词，`#` 匹配零个或多个单词

```
路由键: "user.*.create" → 匹配 "user.admin.create", "user.guest.create"
路由键: "user.#" → 匹配 "user", "user.admin", "user.admin.create"
```

### 4. Headers Exchange（头部交换机）
- 根据消息头属性进行路由
- 不依赖路由键

## 消息属性

消息除了包含实际数据外，还包含一些属性：

### 基本属性
- **Content Type**: 内容类型（如 application/json）
- **Content Encoding**: 内容编码
- **Delivery Mode**: 传递模式（1=非持久化，2=持久化）
- **Priority**: 优先级（0-255）
- **Correlation ID**: 关联ID
- **Reply To**: 回复队列
- **Expiration**: 过期时间
- **Message ID**: 消息ID
- **Timestamp**: 时间戳
- **Type**: 消息类型
- **User ID**: 用户ID
- **App ID**: 应用ID

## 消息确认机制

### 消费者确认（Consumer Acknowledgments）
- **自动确认**: 消息发送给消费者后立即删除
- **手动确认**: 消费者处理完消息后手动确认

### 发布者确认（Publisher Confirms）
- 确保消息成功到达交换机
- 提供可靠性保证

## 队列属性

### 持久化（Durable）
- 队列在服务器重启后是否保留

### 排他性（Exclusive）
- 队列是否只能被当前连接使用

### 自动删除（Auto Delete）
- 最后一个消费者断开后是否自动删除队列

### 参数（Arguments）
- 队列的额外配置参数

## 连接和信道

### Connection（连接）
- 应用程序与RabbitMQ服务器之间的TCP连接
- 建立连接需要认证

### Channel（信道）
- 在连接内部建立的虚拟连接
- 大部分操作都在信道上进行
- 一个连接可以有多个信道

理解这些基础概念是使用 RabbitMQ 的关键，接下来我们将学习如何在实际应用中使用这些概念。 