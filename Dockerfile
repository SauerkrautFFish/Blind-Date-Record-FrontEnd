# 使用官方 Node.js 镜像作为基础镜像
FROM node

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制项目文件
COPY . .

# 构建 Vue 项目
RUN npm run build

# 安装 nginx 作为 web 服务器
FROM nginx

# 复制构建好的文件到 nginx 目录
COPY --from=0 /app/dist /usr/share/nginx/html

# 暴露端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]