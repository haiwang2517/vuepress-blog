---
title: Github搭建Maven仓库
date: 2023-02-24 14:56:30
sidebar: 'auto'
tags:
 - maven
 - 私服
categories: 
 - 杂项
---

最近写了个[幂等性的starter](../java/idempotent.md) 提交到了github上,然后本地无法依赖这个starter需要把starter包放在`maven私服`才可以.所以就找了找发现github支持搭建私服.

__最终的效果是这样的,可以进行拉取使用.__

![github依赖包](/images/other/githubMaven/githubMaven.png)


## 开始搭建
### github创建token
> 官网 https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-apache-maven-registry

用于发布制品包到github的对应的仓库中 
https://github.com/settings/tokens

1. 用户设置 Settings

![githubSettings](/images/other/githubMaven/githubSettings.png)

2. Developer settings 

![developerSettings](/images/other/githubMaven/developerSettings.png)

3. Personal access tokens   
4. Generate new token(classic)

![tokens](/images/other/githubMaven/tokens.png)

5. 配置权限 delete:packages, repo, write:packages

![scopesConfig](/images/other/githubMaven/scopesConfig.png)

> `需要记录这个Token信息,因为只展示一次.`

### github创建maven-repo仓库
用于存储需要归档的制品包仓库,主要注意仓库必须是公开类型的.具体创建就不对读说,这里贴张图片

![createMavenRepo](/images/other/githubMaven/createMavenRepo.png)


### 本地Maven Settings.xml配置
配置Maven对应的github Servers.
```xml
<settings>
  <activeProfiles>
    <activeProfile>github</activeProfile>
  </activeProfiles>
  <servers>
       <server>
              <id>github</id>
              <!-- 替换githubName 为自己的用户名 -->
              <username>githubName</username>
              <!-- 上面创建的Token -->
              <password>githubToken</password>
       </server>
  </servers>
  <profiles>
	  <profile>
		  <id>github</id>
		  <repositories>
			<repository>
			  <id>central</id>
			  <url>https://repo1.maven.org/maven2</url>
			</repository>
			<repository>
			  <!-- id需要与上面的server对应的id匹配 -->
			  <id>github</id>
			  <name>GitHub githubName Apache Maven Packages</name>
                       <!-- 替换githubName 为自己的用户名 -->
                       <!-- 替换maven-repo 为上面创建的仓库 -->
			  <url>https://maven.pkg.github.com/githubName/maven-repo</url>
			  <snapshots>
				<enabled>true</enabled>
			  </snapshots>
			</repository>
		  </repositories>
		</profile>
  </profiles>
</settings>
```

### 代码中Pom.xml配置
需要把制品包上传的pom中配置以下
```xml
    <distributionManagement>
        <repository>
            <id>github</id>
            <name>GitHub githubName Apache Maven Packages</name>
            <!-- 替换githubName 为自己的用户名 -->
            <!-- 替换maven-repo 为上面创建的仓库 -->
            <url>https://maven.pkg.github.com/githubName/maven-repo</url>
        </repository>
    </distributionManagement>
```

### 发布到github Maven仓库
执行maven进行打包,部署
```bash
mvn clean package deploy
```
查看制品包

![github依赖包](/images/other/githubMaven/githubMaven.png)



### 推送制品包异常     
__Cannot deploy artifacts when Maven is in offline mode__

> Idea > Settings > Build > Maven > Work offline , 去掉 `Work offline` 勾选




## 其他项目依赖使用
其他项目配置github远程仓库地址进行拉取文件
```xml
    <repositories>
        <!--仓库地址-->
        <repository>
            <id>github</id>
            <!-- 替换githubName 为自己的用户名 -->
            <!-- 替换maven-repo 为上面创建的仓库 -->
            <name>GitHub githubName Apache Maven Packages</name>
            <url>https://maven.pkg.github.com/githubName/maven-repo</url>
        </repository>
    </repositories>


    <dependencies>
        <!--引入依赖 -->
        <dependency>
            <groupId>com.xx</groupId>
            <artifactId>hello-package</artifactId>
            <version>1.0</version>
        </dependency>
    </dependencies>
```

