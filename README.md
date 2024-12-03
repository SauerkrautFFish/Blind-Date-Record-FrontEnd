# Blind-Date-Record-FrontEnd

## 构建项目
npm run build:prod

## 上传到自己的docker hub中
docker build -t my-vue-app123 .

docker login -u {username}

docker tag my-vue-app123 {username}/my-vue-app123:latest

docker push {username}/my-vue-app123:latest

## 拉取镜像到本地

docker pull {username}/my-vue-app123:latest
(国内拉取的话, 可以在{username}前加dockerpull.org等进行拉取, 但因为经常变, dockerpull.org不一定有效)

## 创建自定义网络(比如后端要和数据库通信 就需要)
docker network create my_network // 创建自定义网络，因为容器如果重启ip会变，最好的方式是通过域名访问，但是默认网络docker0不支持域名访问，所以需要创建个自定义网络

## 运行
docker run -d -p 80:80 --network my_network {image_id}


## 如果修改了docker配置文件
docker配置文件：/etc/docker/daemon.json

修改完后

sudo systemctl daemon-reload

sudo systemctl restart docker



## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build:prod
```

