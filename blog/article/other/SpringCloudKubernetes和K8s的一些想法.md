---
title: SpringCloudKubernetes和K8s的一些想法
date: 2023-03-09 14:38:30
sidebar: 'auto'
tags:
 - SpringCloudKubernetes
 - K8S
 - 想法
categories: 
 - 杂项
---
这里只是把自己觉得比较好的拿过来记录下,具体可以看原文.     
> 转发: https://www.aiops.com/news/post/21416.html


## 了解都是什么?
拿spring cloud和kubernetes比较有点不公平，spring cloud只是一个开发框架，对于应用如何部署和调度是无能为力的，而kubernetes是一个运维平台。

__Kubernetes是个运维平台.__     
__spring cloud是一个开发框架.__     


kubernetes在Istio还没出来以前，其实只能提供最基础的服务注册、服务发现能力（service只是一个4层的转发代理），istio出来以后，具有了相对完整的微服务能力。而spring cloud这边，除了发布、调度、自愈这些运维平台的功能，其他的功能也支持的比较全面。相对而言，云厂商会更喜欢kubernetes的方案，原因就是三个字：非侵入。平台能力与应用层的解耦，使得云厂商可以非常方便的升级、维护基础设施而不需要去关心应用的情况，这也是我比较看好service mesh这类技术前景的原因。

`如果不用 Spring Cloud，那就是使用 Spring Boot + K8S。`

Spring Cloud Kubernetes，作用是把kubernetes中的服务模型映射到Spring Cloud的服务模型中，以使用Spring Cloud的那些原生sdk在kubernetes中实现服务治理。具体来说，就是把k8s中的services对应到Spring Cloud中的services，k8s中的endpoints对应到Spring Cloud的instances。这样通过标准的Spring Cloud api就可以对接k8的服务治理体系。


老实说，个人认为这个项目的意义并不是很大，毕竟都上k8了，k8本身已经有了比较完善的微服务能力（有注册中心、配置中心、负载均衡能力），应用之间直接可以互相调用，应用完全无感知，你再通过sdk去调用，有点多此一举的感觉。而且现在强调的是语言非侵入，Spring Cloud一个很大的限制是只支持java语言（甚至比较老的j2ee应用都不支持，只支持Spring Boot应用）。所以我个人感觉，这个项目，在具体业务服务层面，使用的范围非常有限。


具体还是要根据实际项目来选择
* 部署平台是K8S优先选择原生K8S提供的能力来治理服务
* 非K8S平台部署,可以采用Spring Cloud来治理服务.






