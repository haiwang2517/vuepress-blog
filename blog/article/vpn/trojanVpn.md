---
title: Trojan 搭建科学上网工具
date: 2020-08-12 13:00:00
sidebar: 'auto'
tags: 
 - trojan
 - vpn
categories: 
 - 工具
---

::: tip
 一个多年的程序员表示墙内查资料特别麻烦，还影响效率，那自己搭建一个科学上网的工具。
:::

[[toc]]


### **准备**  
#### 1. 域名 ####
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 可以在阿里、腾讯或者其他可以购买域名的厂商挑选一个自己比较喜欢的域名。这里顺便解释下**域名和备案没有关系**，我选择的就是.cn的域名。
#### 2. 服务器 ####
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 因为我们需要科学上网，所以要选择一个没有限制地区的服务器即可；服务配置什么的根据自己的需求进行选择，我选择的是2核CPU、4G内存、50硬盘（因为不能再小啦）。 切记要选择**没有限制的地区**。

### **配置**  

#### 1. 域名解析 ####
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 打开[域名服务](https://console.cloud.tencent.com/domain "域名服务")，做域名解析，解析上面准备的公网服务器IP地址。
这里演示的是腾讯云：选择自己的**域名地址**，点击**解析**，选择**快速添加网站/邮箱解析**，选择**网站解析**，输入**上面准备的公网服务器IP地址**,等待半个小时即可（根据域名厂商的不同时间可能也不一样）。

![demo](/images/2020/003TrojanVpn/1.png)


#### 2. 安装软件 ####

::: tip
* abc.cn 修改为 自己的域名地址
* 执行 Trojan.sh 文件后选择1，再输入自己的域名地址
* 执行完 Trojan.sh 会生成 **客户端操作步骤** 记不住的最好保存起来
::: 

> \======================================================================     
>
> Trojan已安装完成，请使用以下链接下载trojan客户端，此客户端已配置好所有参数     
> 1、复制下面的链接，在浏览器打开，下载客户端 （里面有配置文件 config.json）     
> http://abc.cn/3b76008585863612/trojan-cli.zip     
> 请记录下面规则网址     
> http://abc.cn/trojan.txt     
> 2、将下载的压缩包解压，打开文件夹，打开start.bat即打开并运行Trojan客户端     
> 3、打开stop.bat即关闭Trojan客户端     
> 4、Trojan客户端需要搭配浏览器插件使用，例如switchyomega等     
> 访问  https://www.v2rayssr.com/trojan-1.html ‎ 下载 浏览器插件 及教程     
> \======================================================================

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **ssh登录到服务器，执行以下命令：**

```shell
set pubilc ip -> abc.cn
sudo su
curl -O https://raw.githubusercontent.com/V2RaySSR/Trojan/master/Trojan.sh
sudo chmod a+x Trojan.sh
sudo su
./Trojan.sh

#select 1
# abc.cn
```

> 在浏览器中打开 abc.cn 可以正常显示界面即可，如果没有显示有可能是域名解析的问题。


#### 3. 本地配置 ####

##### **下载客户端配置文件**
```shell
下载上面步骤生成的客户端步骤中的文件,内容如下：
1、复制下面的链接，在浏览器打开，下载客户端 （里面有配置文件 config.json）
http://abc.cn/xxxxxxxxxxxxx/trojan-cli.zip
```

##### **下载链接客户端**
提供一个[Linux客户端下载地址](/images/2020/003TrojanVpn/Trojan-Qt5-Linux.AppImage "Linux客户端下载地址")，其他客户端链接也是可以的。

##### **本地配置链接**
打开客户端，导入zip包中的config.json文件，链接即可。    
对了Trojan客户端需要搭配浏览器插件使用，例如switchyomega等，这个配置具体的baidu一下，很简单。    

![config](/images/2020/003TrojanVpn/2.png)

