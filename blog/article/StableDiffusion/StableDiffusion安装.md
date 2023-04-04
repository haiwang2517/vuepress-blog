---
title: Stable Diffusion安装
date: 2023-04-03 13:00:00
sidebar: 'auto'
tags: 
 - Stable Diffusion
 - AI
categories: 
 - 工具
---


::: tip

 最近AI画图工具很火爆网上一大堆介绍的，就跟潮流研究部署到本地感受感受。

:::

![result](/images/StableDiffusion/result.png)


>  github 地址:[https://github.com/AUTOMATIC1111/stable-diffusion-webui](https://github.com/AUTOMATIC1111/stable-diffusion-webui)    
>  huggingface: [https://huggingface.co/](https://huggingface.co/)    
>  civitai: [https://civitai.com/](https://civitai.com/)     



## 安装步骤
### 1. 环境准备
* python3: Python 3.10.7
* git:  2.36.1

__python 配置__
切换国内源

```bash
pip config set global.index-url http://mirrors.cloud.tencent.com/pypi/simple
pip config set global.trusted-host mirrors.cloud.tencent.com
```

```bash
常用国内源
pypi 清华大学源：https://pypi.tuna.tsinghua.edu.cn/simple
pypi 豆瓣源 ：http://pypi.douban.com/simple/
pypi 腾讯源：http://mirrors.cloud.tencent.com/pypi/simple
pypi 阿里源：https://mirrors.aliyun.com/pypi
```

### 2. 下载stable diffusion
本地指定文件夹下载git代码
```bash
git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui
cd stable-diffusion-webui
```



### 3. 本地配置stable diffusion

#### __webui-user.bat配置__
```bat
@echo off
# 指定python路径
set PYTHON="C:\Python310\python.exe"
# 指定git路径,不需要配置
set GIT=
set VENV_DIR=
# 配置启动参数
set COMMANDLINE_ARGS= --precision full --no-half --skip-torch-cuda-test --xformers

# 启动程序
call webui.bat
```
#### __属性说明__
* __skip-torch-cuda-test:__ 针对没有显卡的电脑,跳过环境检测

```bash
# 方法1 通过代码查看所有参数
cat modules/cmd_args.py
```




#### __launch.py配置__

__去除cu117安装__
```bash
torch_command = os.environ.get('TORCH_COMMAND', "pip install torch==1.13.1+cu117 torchvision==0.14.1+cu117 --extra-index-url https://download.pytorch.org/whl/cu117")
改为
torch_command = os.environ.get('TORCH_COMMAND', "pip install torch==1.13.1 torchvision==0.14.1")
```

__替换github地址__
```bash
https://github.com/ 开通的连接 替换为  https://ghproxy.com/https://github.com/ 
```

__具体改动项__

![ghproxy](/images/StableDiffusion/ghproxy.jpg)


### 4. 启动stable diffusion
执行打开`webui-user.bat` 脚本文件.


![start](/images/StableDiffusion/start.jpg)


## 遇到的异常情况

* git 提示 ssl 
```bash
git config http.sslVerify "false"

```
* 启动异常时,删除再启动
```bash
#如果有异常删除 venv 文件夹
rm -rf venv
```


## 高级用法(扩展插件)

### 1. 扩展插件地址: 
[https://raw.githubusercontent.com/wiki/AUTOMATIC1111/stable-diffusion-webui/Extensions-index.md](https://raw.githubusercontent.com/wiki/AUTOMATIC1111/stable-diffusion-webui/Extensions-index.md)
### 2. Nvidia CUDA: 
[https://developer.download.nvidia.cn/compute/cuda/11.7.1/local_installers/cuda_11.7.1_516.94_windows.exe](https://developer.download.nvidia.cn/compute/cuda/11.7.1/local_installers/cuda_11.7.1_516.94_windows.exe)


##  语音汉化
[github汉化地址](https://github.com/VinsonLaro/stable-diffusion-webui-chinese)

### 直接复制翻译好的本地化模板
1. 在任意目录下使用`git clone https://github.com/VinsonLaro/stable-diffusion-webui-chinese`

2. 进入下载好的文件夹,把"localizations"文件夹内的"Chinese-All.json"和"Chinese-English.json"复制到"stable-diffusion-webui\localizations"目录下

3. 点击"Settings"，左侧点击"User interface"界面，在界面里最下方的"Localization (requires restart)"，选择"Chinese-All"或者"Chinese-English"

4. 点击界面最上方的黄色按钮"Apply settings"，再点击右侧的"Reload UI"即可完成汉化


## 案例

__ProtoGen_X3.4模型参数__

__最终效果__

![result](/images/StableDiffusion/result.png)


提示词:
```text
(extremely detailed CG unity 8k wallpaper), full shot body photo of [Emma Stone | emma watson] as princess peach, smiling, nostalgia, fantasy, princess peach clothes, sexy, professional majestic oil painting by Ed Blinkey, Atey Ghailan, Studio Ghibli, by Jeremy Mann, Greg Manchess, Antonio Moro, trending on ArtStation, trending on CGSociety, Intricate, High Detail, Sharp focus, dramatic, by midjourney and greg rutkowski, realism, beautiful and detailed lighting, shadows, by Jeremy Lipking, by Antonio J. Manzanedo, by Frederic Remington, by HW Hansen, by Charles Marion Russell, by William Herbert Dunton, Pin-up, Skater, Otaku, cinematic 
```

反提示词:
```text
Negative prompt: hat, disfigured, kitsch, ugly, oversaturated, grain, low-res, Deformed, blurry, bad anatomy, disfigured, poorly drawn face, mutation, mutated, extra limb, ugly, poorly drawn hands, missing limb, blurry, floating limbs, disconnected limbs, malformed hands, blur, out of focus, long neck, long body, ugly, disgusting, poorly drawn, childish, mutilated,, mangled, old, surreal, text, blurry, b&w, monochrome, conjoined twins, multiple heads, extra legs, extra arms, fashion photos (collage: 1,25), meme,deformed,elongated,twisted,fingers,strabismus,heterochromia,closed eyes,blurred, watermark, wedding,group 
```

参数配置:
```text
Steps: 50, Sampler: DPM++ SDE Karras, CFG scale: 10, Seed: 3816429603, Size: 640x832, Model hash: c88e730a
```





![webui](/images/StableDiffusion/webui.jpg)



> 参考来源: https://www.bilibili.com/read/cv22020510/ 、 https://www.bilibili.com/read/cv19102458/