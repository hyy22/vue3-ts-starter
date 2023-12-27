# 基础镜像
FROM node:18.18.2-slim as base
WORKDIR /web
COPY package.json yarn.lock ./
# 开发依赖
FROM base as dev-deps
RUN yarn --registry https://registry.npmmirror.com
# 编译
FROM dev-deps as build
COPY . .
RUN yarn build
# 运行时
FROM nginx
COPY --from=build /web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /web/dist/ /usr/share/nginx/html
EXPOSE 80