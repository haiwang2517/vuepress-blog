---
title: Ubuntu配置ip_forward报文转发
date: 2023-02-28 13:54:30
sidebar: 'auto'
tags:
 - linux
 - iptables
categories: 
 - 杂项
---

腾讯云redis有活动,想着价格便宜就买一个来玩玩,买完后发现只能内网访问,不提供外网访问地址!!-_-,但身为程序猿怎么能被这点小事难倒那,就有了这篇文章.

![redis](/images/other/ubuntuConfigIpForward/redisInfo.jpg)

还好之前在腾讯云上有一台服务器,想着redis没有外网ip,可以使用服务器的外网ip呀. 在服务器上用`ip_forward` 做报文转发到redis.

__需要最高权限__

```bash
sudo su root 
```

1. 开启服务器中报文转发配置

```bash
echo 1 > /proc/sys/net/ipv4/ip_forward
```

2. 添加Iptables设置过滤规则

__映射63790端口到 10.206.0.13:6379__

```bash
iptables -t nat -A PREROUTING -p tcp --dport 63790 -j DNAT --to-destination 10.206.0.13:6379

iptables -t nat -A POSTROUTING -d 10.206.0.13 -p tcp --dport 6379 -j MASQUERADE

```

3. 保存Iptables规则

```bash
iptables-save > /etc/iptables.rules
```
4. 重启系统后，使配置生效，需要运行命令

```bash
iptables-restore < /etc/iptables.rules
```

__测试连接__

![redis](/images/other/ubuntuConfigIpForward/redisConnect.jpg)
