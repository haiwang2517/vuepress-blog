---
title: Spring循环依赖问题
date: 2023-03-02 11:35:50
sidebar: 'auto'
tags:
 - Spring
 - 循环依赖
categories: 
 - java
---

> 参考 https://www.freesion.com/article/9009504573/    

> 参考 https://blog.csdn.net/JAVA88866/article/details/124709836

最近公司项目在部署上线的时候遇到`循环依赖问题`,小朋友就很奇怪本地为啥可以部署上线就不可以。在解决这个问题的时候就又梳理了下Spring的三级缓存.

首先解决小朋友遇到的问题原因,是因为Spring在加载Bean的时候是随机的,导致Bean初始化顺序与本地不一样.


![circular](/images/java/Spring循环依赖/circular.png)

有循环依赖的情况,最好的办法就是去重构代码说明逻辑有问题.其次在开启Spring 三级缓存,Spring已经默认是关闭的.

```properties
spring.main.allow-circular-references=true
```

![allow-circular-references](/images/java/Spring循环依赖/circularReferences.png)



### 了解spring三级缓存的时候需要先知道Spring Bean创建流程.

![createBean](/images/java/Spring循环依赖/createBean.png)

1. Spring 解析Bean 为 BeanDefinition
2. 遍历BeanDefinition进行Bean对象创建
3. doGetBean 进行获取Bean,从(一二三)缓存中获取
4. 获取不到时,进入createBean方法创建bean
5. doCreateBean 执行创建bean
6. createBeanInstance 在堆中创建该bean, `这时bean的属性还都为null`
7. __注意__,这时候会根据是否允许循环依赖,如果开启就把当前bean放入三级缓存中(addSingletonFactory > getEarlyBeanReference(生成代理对象)).
8. populateBean 注入属性,如果依赖其他bean的时会调用`getSingleton > doGetBean` 走2.2步骤 . 如果找到就注入成功.`这时候这里的属性已经有值了`. `__循环依赖就是这里发生的__`
9. initializeBean 主要执行 `BeanPostProcessor` 处理器
10  其他操作,验证循环依赖等,暴露bean.


### Spring 三级缓存

在Spring的DefaultSingletonBeanRegistry类中内部维护了三个Map，也就是我们通常说的三级缓存。



* 一级缓存(singletonObjects)， Cache of singleton objects bean name --> bean instance。 存放完整对象。   
* 二级缓存(earlySingletonObjects)， Cache of early singleton objects bean name --> bean instance 提前曝光的BEAN缓存。 存放半成品对象。    
* 三级缓存(singletonFactories)， Cache of singleton factories bean name --> ObjectFactory。需要的对象被代理时，就必须使用三级缓存（否则二级就够了）。解决循环依赖中存在aop的问题 存放 lambda 表达式和对象名称的映射。  


```java
public class DefaultSingletonBeanRegistry extends SimpleAliasRegistry implements SingletonBeanRegistry {
	...
	// 从上至下 分表代表这“三级缓存”
	private final Map<String, Object> singletonObjects = new ConcurrentHashMap<>(256); //一级缓存
	private final Map<String, Object> earlySingletonObjects = new HashMap<>(16); // 二级缓存
	private final Map<String, ObjectFactory<?>> singletonFactories = new HashMap<>(16); // 三级缓存
	...
	
	/** Names of beans that are currently in creation. */
	// 这个缓存也十分重要：它表示bean创建过程中都会在里面呆着~
	// 它在Bean开始创建时放值，创建完成时会将其移出~
	private final Set<String> singletonsCurrentlyInCreation = Collections.newSetFromMap(new ConcurrentHashMap<>(16));
 
	/** Names of beans that have already been created at least once. */
	// 当这个Bean被创建完成后，会标记为这个 注意：这里是set集合 不会重复
	// 至少被创建了一次的  都会放进这里~~~~
	private final Set<String> alreadyCreated = Collections.newSetFromMap(new ConcurrentHashMap<>(256));

    /** Bean移动到 一级缓存中,情况其他缓存中的数据  */
    protected void addSingleton(String beanName, Object singletonObject) {
		synchronized (this.singletonObjects) {
			this.singletonObjects.put(beanName, singletonObject);
			this.singletonFactories.remove(beanName);
			this.earlySingletonObjects.remove(beanName);
			this.registeredSingletons.add(beanName);
		}
	}

    /** 添加Bean到三级缓存中 */
	protected void addSingletonFactory(String beanName, ObjectFactory<?> singletonFactory) {
		Assert.notNull(singletonFactory, "Singleton factory must not be null");
		synchronized (this.singletonObjects) {
			if (!this.singletonObjects.containsKey(beanName)) {
				this.singletonFactories.put(beanName, singletonFactory);
				this.earlySingletonObjects.remove(beanName);
				this.registeredSingletons.add(beanName);
			}
		}
	}

    /** 获得Bean, 注意如果在三级缓存中获取到的时候就把三级缓存的bean移动到二级缓存中 */
    protected Object getSingleton(String beanName, boolean allowEarlyReference) {
		// Quick check for existing instance without full singleton lock
		Object singletonObject = this.singletonObjects.get(beanName);
		if (singletonObject == null && isSingletonCurrentlyInCreation(beanName)) {
			singletonObject = this.earlySingletonObjects.get(beanName);
			if (singletonObject == null && allowEarlyReference) {
				synchronized (this.singletonObjects) {
					// Consistent creation of early reference within full singleton lock
					singletonObject = this.singletonObjects.get(beanName);
					if (singletonObject == null) {
						singletonObject = this.earlySingletonObjects.get(beanName);
						if (singletonObject == null) {
							ObjectFactory<?> singletonFactory = this.singletonFactories.get(beanName);
                            // 注意如果在三级缓存中获取到的时候就把三级缓存的bean移动到二级缓存中
							if (singletonFactory != null) {
								singletonObject = singletonFactory.getObject();
								this.earlySingletonObjects.put(beanName, singletonObject);
								this.singletonFactories.remove(beanName);
							}
						}
					}
				}
			}
		}
		return singletonObject;
	}
}
```
  


### 具体是怎么解决循环依赖的那?

Spring 二级缓存提前暴露的并不是实例化的Bean,而是将Bean包装起来ObjectFactory. 为什么要这么做? 实际上Spring一开始并不知道Bean是否有循环依赖,没有依赖的情况下都可以正常的填充属性对象,如果有依赖Spring不得不为其提前创建代理对象,代理对象对执行`getObject方法`获取到Bean.
Spring需要三级缓存的目的是为了延迟代理对象的创建,如果没有依赖循环的话，那么就不需要为其提前创建代理，可以将它延迟到初始化完成之后再创建。


### 为什么 Spring 不选择二级缓存，而要额外多添加一层缓存呢？

如果Spring 选择二级缓存来解决循环依赖的话，那么就意味着所有 Bean 都需要在实例化完成之后就立马为其创建代理，而Spring 的设计原则是在 Bean 初始化完成之后才为其创建代理。所以，Spring 选择了三级缓存。但是因为循环依赖的出现，导致了 Spring 不得不提前去创建代理，因为如果不提前创建代理对象，那么注入的就是原始对象，这样就会产生错误。



### 注意主bean对象通过构造函数注入所依赖bean对象时会出现异常
主要是主bean对象通过构造函数注入所依赖bean对象时，无法创建该所依赖的bean对象，获取该所依赖bean对象的引用。因为如下代码所示。
创建主bean对象，调用顺序为：
1. 调用构造函数 
2. 放到三级缓存 
3. 属性赋值。其中调用构造函数时会触发所依赖的bean对象的创建。

`createBeanInstance`是调用构造函数创建主bean对象，在里面会注入构造函数中所依赖的`bean`，而此时并没有执行到`addSingletonFactory`方法来添加主bean对象的创建工厂到三级缓存`singletonFactories`中。故在`createBeanInstance`内部，注入和创建该主bean对象时，如果在构造函数中存在对其他bean对象的依赖，并且该bean对象也存在对主bean对象的依赖，则会出现循环依赖问题.


