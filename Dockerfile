# 安装 nginx 作为 web 服务器
FROM nginx

# 复制构建好的文件到 nginx 目录
COPY ./dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf
# 暴露端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]