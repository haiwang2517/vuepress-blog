#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

cd ../
# 生成静态文件
npm run build

# 进入生成的文件夹
cd public

# 如果是发布到自定义域名
echo 'blog.haiyinlong.cn' > CNAME

git init
git add -A
# git commit -m 'feat: deploy article'
git commit -m 'feat: add stable diffusion doc'

# 如果发布到 https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master
git push -f git@github.com:haiwang2517/haiwang2517.github.io.git master
