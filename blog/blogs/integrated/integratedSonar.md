---
title: Gradle集成Sonar插件及Jenkins触发Sonar Scanner
date: 2020-08-06 20:00:00
sidebar: 'auto'
tags:
 - gradle
 - java
 - 插件
 - sonar
categories: 
 - sonar
---
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Sonar相信大家都已经很熟悉啦，这里就不多介绍啦。本章主要介绍Gradle集成Sonar和Jenkins触发Sonar Scanner，Sonar的搭建和配置不在这里介绍。


### **环境准备**
|环境|是否必须|测试数据|
|:--|:--:|:--|
|Sonar 服务|&radic;|http://sonar.xxx.com|
|Sonar 服务token|&radic;|xxxx|
|Jacoco 插件|&radic;||
|sonarqube 插件|&radic;|3.0|
|Gradle|&radic;|6.4|
|Jenkins 服务|&radic;|2.22|

### **Gradle集成插件**

#### **在build.gradle文件中添加一下代码就拥有了Sonar Scanner能力**
```groovy
buildscript {
    dependencies {
        classpath "org.sonarsource.scanner.gradle:sonarqube-gradle-plugin:3.0"
    }
}
 
apply plugin: 'jacoco'
apply plugin: "org.sonarqube"
 
sonarqube {
    properties {
        property("sonar.sourceEncoding", "UTF-8")
        property("sonar.host.url", "http://sonar.xxx.com")
        property("sonar.login", "xxxx")
        property("sonar.java.coveragePlugin", "jacoco")
        property("sonar.scm.disabled", "true")
        property("sonar.coverage.jacoco.xmlReportPaths", "$buildDir/reports/jacoco/test/jacocoTestReport.xml")
        property("sonar.exclusions", "**/test/java/**,**/dto/**, **/bo/**, **/vo/**, **/exception/**")
 
    }
}
jacocoTestReport {
    reports {
        xml.enabled true
        html.enabled true
    }
}
```
##### **拆分说明**

##### **1.build.gradle 添加插件**
```groovy
buildscript {
    dependencies {
        classpath "org.sonarsource.scanner.gradle:sonarqube-gradle-plugin:3.0"
    }
}
 
apply plugin: 'jacoco'
apply plugin: "org.sonarqube"
```

##### **2.配置sonar参数**
```groovy
sonarqube {
    properties {
        property("sonar.sourceEncoding", "UTF-8")
        // sonar 地址
        property("sonar.host.url", "http://sonar.xxx.com")
        property("sonar.login", "xxxx")
        // 单元覆盖率使用的组件
        property("sonar.java.coveragePlugin", "jacoco")
        property("sonar.scm.disabled", "true")
        // 获取Jacoco生成的xml文件，做覆盖率统计
        property("sonar.coverage.jacoco.xmlReportPaths", "$buildDir/reports/jacoco/test/jacocoTestReport.xml")
        // 排除扫描路径
        property("sonar.exclusions", "**/test/java/**,**/dto/**, **/bo/**, **/vo/**, **/exception/**")
    }
}
```

##### **3.配置jacoco生成xml文件和html文件**
```groovy
jacocoTestReport {
    reports {
        // 因我们sonar是依赖与jacoco生成的xml，所以这里必须是true
        xml.enabled true
        html.enabled true
    }
}
```

##### **4.测试执行**
```shell
   ./gradlew sonarqube
```


### **Jenkins 触发 sonar scanner**

**假如以下操作已经配置好了**
> **Jenkins 安装插件  Sonar for jenkins**      
> **在系统配置中配置插件对应的Sonar信息** 

##### **流水线添加Sonar Scanner步骤**
```groovy
stage('sonar scanner') {
    steps {
        withSonarQubeEnv('sonarQube') {
            sh '''#!/bin/bash
            set -xe
            ./src/$project/gradlew sonarqube
            '''
        }
    }
}
```

集成完成，可以愉快的使用Sonar检查代码啦。