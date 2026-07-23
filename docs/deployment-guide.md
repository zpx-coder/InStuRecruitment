# YiwuTrade 留学生招聘系统 — 阿里云部署指引

> 适用版本：v1.0  
> 目标环境：阿里云 ECS + Nginx + PM2 + MySQL 5.6  
> 最后更新：2026-07-21

---

## 目录

1. [架构概览](#1-架构概览)
2. [阿里云资源准备](#2-阿里云资源准备)
3. [环境初始化](#3-环境初始化)
4. [项目构建](#4-项目构建)
5. [Nginx 配置](#5-nginx-配置)
6. [后端部署（PM2）](#6-后端部署pm2)
7. [数据库](#7-数据库)
8. [域名与 SSL](#8-域名与-ssl)
9. [验证与排错](#9-验证与排错)
10. [日常运维](#10-日常运维)

---

## 1. 架构概览

```
用户浏览器
    │
    ▼
┌─────────────────────────────────────────┐
│                 Nginx                    │
│  ┌──────────┐ ┌──────────┐              │
│  │   H5     │ │  Admin   │  静态文件     │
│  │ :80/443  │ │ :80/443  │              │
│  └──────────┘ └──────────┘              │
│  /api/*  ──────────────►  localhost:3000 │
└─────────────────────────────────────────┘
                                 │
                                 ▼
                      ┌──────────────────┐
                      │  Express API     │
                      │  (PM2 管理)       │
                      │  port 3000        │
                      └────────┬─────────┘
                               │
                               ▼
                      ┌──────────────────┐
                      │  MySQL 5.6       │
                      └──────────────────┘
```

- **H5 前端**：Vue 3 + Vant 4，纯静态文件，Nginx 直接托管
- **Admin 后台**：Vue 3 + Element Plus，纯静态文件，Nginx 直接托管
- **后端 API**：Express + Prisma，PM2 守护进程
- **数据库**：MySQL 5.6

---

## 2. 阿里云资源准备

### 2.1 ECS 云服务器

| 配置项 | 推荐值 | 说明 |
|--------|--------|------|
| 实例规格 | 2 vCPU / 4 GiB | 入门级可选 1 vCPU / 2 GiB |
| 系统盘 | 40 GiB 高效云盘 | 含 OS + 项目 + 依赖 |
| 操作系统 | Ubuntu 22.04 LTS | 或 CentOS 7.9 / Alibaba Cloud Linux |
| 带宽 | 按量 100 Mbps | 或固定 5 Mbps 起步 |
| 安全组 | 开放 22 / 80 / 443 | 3000 端口无需公网开放 |

### 2.2 域名（可选，推荐）

- 在阿里云域名服务注册或转入域名，如 `yiwutrade.com`
- 解析 A 记录到 ECS 公网 IP
- 如需分域名访问：`h5.yiwutrade.com`、`admin.yiwutrade.com`、`api.yiwutrade.com`

### 2.3 SSL 证书（可选，但强烈推荐）

- 阿里云 SSL 证书服务提供免费 DV 证书（单域名）
- 或使用 Let's Encrypt / certbot 自动签发

---

## 3. 环境初始化

SSH 登录 ECS 后，依次执行：

### 3.1 系统更新 & 基础工具

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git nginx ufw build-essential
```

### 3.2 Node.js 18+

```bash
# 使用 NodeSource 安装
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 验证
node -v   # >= 18.0.0
npm -v
```

### 3.3 全局安装 PM2

```bash
sudo npm install -g pm2
```

### 3.4 创建应用目录

```bash
sudo mkdir -p /var/www/yiwutrade
sudo chown -R $USER:$USER /var/www/yiwutrade
```

---

## 4. 项目构建

### 4.1 上传项目代码

```bash
# 方式一：Git 克隆（推荐）
cd /var/www
git clone <your-repo-url> yiwutrade
cd yiwutrade

# 方式二：rsync / scp 上传本地已构建产物
# (跳过编译步骤)
```

### 4.2 安装依赖

```bash
# 在项目根目录
npm install
```

> 注意：`bcrypt` 和 `prisma` 依赖需要编译原生模块，确保已安装 `build-essential` 和 `python3`。

### 4.3 配置环境变量

```bash
# 创建生产环境变量文件
cp packages/server/.env.example packages/server/.env
```

编辑 `packages/server/.env`：

```env
# ---- 数据库 ----
# MySQL 5.6
DATABASE_URL="mysql://root:mysql@localhost:3306/yiwutrade"

# ---- JWT ----
# ⚠️ 务必改为随机字符串（可用 openssl rand -hex 32 生成）
JWT_SECRET="change-me-to-a-random-string-at-least-32-chars"

# Token 有效期（秒），默认 86400 = 24 小时
JWT_EXPIRES_IN=86400

# ---- 护照加密密钥 ----
# ⚠️ 32 个十六进制字符（16 字节），务必生成新的
# 生成命令：openssl rand -hex 16
PASSPORT_ENCRYPTION_KEY="0123456789abcdef0123456789abcdef"

# ---- 服务端口 ----
PORT=3000
NODE_ENV=production

# ---- CORS 白名单（生产环境改为实际域名）----
CORS_ORIGIN=https://h5.yiwutrade.com,https://admin.yiwutrade.com
```

> ⚠️ 安全提醒：生产环境**必须**更换 `JWT_SECRET` 和 `PASSPORT_ENCRYPTION_KEY`，不可使用示例值。

### 4.4 构建前端

```bash
# 构建 H5 移动端
npm run build:h5
# 产物：packages/h5/dist/

# 构建 Admin 后台
npm run build:admin
# 产物：packages/admin/dist/
```

### 4.5 数据库初始化

```bash
cd packages/server

# 运行数据库迁移（创建表结构）
npx prisma migrate deploy

# 创建管理员账号
npx tsx prisma/seed.ts
```

> 默认管理员账号：`admin` / `admin123`  
> ⚠️ 首次登录后立即修改密码。

### 4.6 编译后端 TypeScript（可选）

```bash
# 生产环境可直接用 tsx 运行，无需编译
# 如需编译为 JS：
cd packages/server && npx tsc
# 产物在 packages/server/dist/
```

---

## 5. Nginx 配置

### 5.1 创建配置文件

```bash
sudo nano /etc/nginx/sites-available/yiwutrade
```

```nginx
# ===== YiwuTrade — Nginx 配置 =====

# ---- 上游 API ----
upstream api_backend {
    server 127.0.0.1:3000;
    keepalive 64;
}

# ---- HTTP → HTTPS 重定向 ----
server {
    listen 80;
    server_name h5.yiwutrade.com admin.yiwutrade.com api.yiwutrade.com;
    return 301 https://$host$request_uri;
}

# ---- H5 移动端 ----
server {
    listen 443 ssl http2;
    server_name h5.yiwutrade.com;

    ssl_certificate     /etc/nginx/ssl/h5.yiwutrade.com.pem;
    ssl_certificate_key /etc/nginx/ssl/h5.yiwutrade.com.key;

    root /var/www/yiwutrade/packages/h5/dist;
    index index.html;

    # API 反向代理
    location /api/ {
        proxy_pass http://api_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Connection "";
        client_max_body_size 10m;
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# ---- Admin 后台 ----
server {
    listen 443 ssl http2;
    server_name admin.yiwutrade.com;

    ssl_certificate     /etc/nginx/ssl/admin.yiwutrade.com.pem;
    ssl_certificate_key /etc/nginx/ssl/admin.yiwutrade.com.key;

    root /var/www/yiwutrade/packages/admin/dist;
    index index.html;

    # API 反向代理
    location /api/ {
        proxy_pass http://api_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Connection "";
        client_max_body_size 10m;
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

> 如果只有一个域名，将 H5 和 Admin 分别部署在不同路径（如 `/h5/` 和 `/admin/`）或不同子域名。

### 5.2 启用站点

```bash
sudo ln -s /etc/nginx/sites-available/yiwutrade /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default   # 移除默认站点

# 检查配置语法
sudo nginx -t

# 重载 Nginx
sudo systemctl reload nginx
```

### 5.3 防火墙

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

---

## 6. 后端部署（PM2）

### 6.1 PM2 配置文件

在项目根目录创建 `ecosystem.config.js`：

```javascript
// ecosystem.config.js — PM2 配置
module.exports = {
  apps: [
    {
      name: 'yiwutrade-api',
      cwd: '/var/www/yiwutrade/packages/server',
      script: 'node_modules/.bin/tsx',
      args: 'src/index.ts',
      interpreter: 'node',

      // 进程数量
      instances: 1,               // 单实例（SQLite 不支持多进程写入）
      exec_mode: 'fork',

      // 环境变量
      env: {
        NODE_ENV: 'production',
      },

      // 自动重启
      autorestart: true,
      max_restarts: 10,
      restart_delay: 5000,

      // 日志
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: '/var/log/yiwutrade/error.log',
      out_file: '/var/log/yiwutrade/out.log',
      merge_logs: true,
    },
  ],
};
```

### 6.2 启动服务

```bash
# 创建日志目录
sudo mkdir -p /var/log/yiwutrade
sudo chown -R $USER:$USER /var/log/yiwutrade

# 启动
pm2 start ecosystem.config.js

# 保存 PM2 进程列表（重启后自动恢复）
pm2 save

# 设置开机自启
pm2 startup systemd
# 按提示执行输出的 sudo 命令
```

### 6.3 常用 PM2 命令

```bash
pm2 status              # 查看进程状态
pm2 logs yiwutrade-api  # 查看日志
pm2 restart yiwutrade-api  # 重启
pm2 stop yiwutrade-api     # 停止
pm2 delete yiwutrade-api   # 删除
pm2 monit               # 实时监控面板
```

---

## 7. 数据库

### 7.1 当前方案：MySQL 5.6

- 数据库服务运行在 Docker 容器中（`docker-compose up -d`）
- 连接字符串：`mysql://root:mysql@localhost:3306/yiwutrade`
- **注意**：
  - 生产环境务必修改 root 密码
  - 定期备份数据库（`mysqldump`）
  - MySQL 5.6 已于 2021 年 2 月停止官方安全更新，生产环境建议升级至 MySQL 8.0

### 7.2 数据库备份（MySQL）

```bash
# 每日备份脚本
mysqldump -u root -p yiwutrade > /backup/yiwutrade-$(date +\%Y\%m\%d).sql

# 添加 crontab 定时备份（每天凌晨 3 点）
0 3 * * * mysqldump -u root -p<password> yiwutrade > /backup/yiwutrade-$(date +\%Y\%m\%d).sql
```

### 7.3 阿里云 RDS MySQL（可选）

如需使用阿里云托管数据库：

1. 在阿里云创建 **云数据库 RDS MySQL 5.6** 实例
2. 修改 `DATABASE_URL`：
   ```env
   DATABASE_URL="mysql://user:password@rm-xxx.mysql.rds.aliyuncs.com:3306/yiwutrade"
   ```
3. 运行迁移：
   ```bash
   cd packages/server
   npx prisma migrate deploy
   npx tsx prisma/seed.ts
   ```
4. PM2 重启：
   ```bash
   pm2 restart yiwutrade-api
   ```

---

## 8. 域名与 SSL

### 8.1 阿里云 SSL 证书

1. 登录 [SSL 证书控制台](https://yundun.console.aliyun.com/)
2. 购买免费 DV 证书（单域名，有效期 3 个月）
3. 填写域名 → DNS 验证 → 下载 Nginx 格式证书
4. 上传至服务器 `/etc/nginx/ssl/` 目录
5. 在 Nginx 配置中引用（参考第 5 节）

### 8.2 Let's Encrypt（替代方案）

```bash
sudo apt install -y certbot python3-certbot-nginx

# 自动获取并配置
sudo certbot --nginx -d h5.yiwutrade.com -d admin.yiwutrade.com

# 设置自动续期
sudo certbot renew --dry-run   # 测试
# certbot 默认已添加 systemd timer，自动续期
```

---

## 9. 验证与排错

### 9.1 验证清单

| 检查项 | 命令 / 方式 |
|--------|------------|
| Node 进程运行中 | `pm2 status` |
| API 响应正常 | `curl http://localhost:3000/api/dict/options` |
| Nginx 静态文件可达 | 浏览器访问 `https://h5.yiwutrade.com` |
| Admin 登录正常 | 浏览器访问 `https://admin.yiwutrade.com` |
| H5 表单提交正常 | 在 H5 页面提交一条测试数据 |
| SSL 证书有效 | 浏览器地址栏显示锁图标 |

### 9.2 常见问题

| 问题 | 可能原因 | 解决 |
|------|----------|------|
| 502 Bad Gateway | PM2 未启动或端口不对 | `pm2 status`，检查 3000 端口 |
| 页面空白 | SPA fallback 未生效 | 检查 Nginx `try_files` 配置 |
| API CORS 错误 | CORS_ORIGIN 未包含当前域名 | 更新 `.env` 中 `CORS_ORIGIN`，重启 PM2 |
| 登录失败 | 数据库未迁移 / seed 未执行 | 重跑 `prisma migrate deploy` 和 `seed.ts` |
| 数据库连接失败 | MySQL 服务未启动或连接串错误 | 检查 Docker 容器状态及 `DATABASE_URL` |
| 静态资源 404 | 构建产物路径不对 | 检查 Nginx `root` 指向 `<package>/dist/` |

### 9.3 日志排查

```bash
# API 日志
pm2 logs yiwutrade-api --lines 50

# Nginx 访问日志
sudo tail -f /var/log/nginx/access.log

# Nginx 错误日志
sudo tail -f /var/log/nginx/error.log
```

---

## 10. 日常运维

### 10.1 更新部署流程

```bash
# 1. 拉取最新代码
cd /var/www/yiwutrade
git pull origin main

# 2. 安装新依赖（如有）
npm install

# 3. 构建前端
npm run build:h5
npm run build:admin

# 4. 运行数据库迁移（如有）
cd packages/server
npx prisma migrate deploy

# 5. 重启后端
pm2 restart yiwutrade-api
```

### 10.2 备份策略

| 备份内容 | 频率 | 方式 |
|----------|------|------|
| MySQL 数据库 | 每日 | `mysqldump` + crontab |
| 环境变量文件 | 变更时 | Git 仓库外单独保存 |
| Nginx 配置 | 变更时 | 版本控制或注释记录 |

### 10.3 监控建议

- **阿里云云监控**：ECS CPU / 内存 / 磁盘 / 网络监控
- **PM2 面板**：`pm2 monit` 实时查看进程资源
- **日志轮转**：PM2 自动管理日志文件大小
- **告警**：设置 CPU > 80% 或磁盘 > 85% 告警通知

---

> **技术支持**：项目核心团队  
> **文档版本**：v1.0  
> **最后更新**：2026-07-21
