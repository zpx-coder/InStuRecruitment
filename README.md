# International Students Recruitment — YiwuTrade

> 留学生招聘报名系统 v1.0

## 项目简介

面向外国在华留学生的招聘报名系统。留学生通过移动端 H5 页面提交个人简历与求职意向，招聘方在 PC 后台查看、筛选和导出报名数据。

| 端 | 用户 | 语言 | 技术栈 |
|----|------|------|--------|
| H5 报名端 | 留学生 | English | Vue 3 + Vite + Vant 4 |
| Admin 后台 | 管理员 | 中文 | Vue 3 + Vite + Element Plus |
| API 服务 | — | — | Express.js + Prisma + MySQL 5.6 |

## 快速开始

### 环境要求

- Node.js ≥ 18
- npm ≥ 9
- （可选）Docker Desktop — 用于 MySQL 本地环境

### 本地启动

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp packages/server/.env.example packages/server/.env
# 编辑 .env 填入实际配置

# 3. 初始化数据库
npm run db:migrate
npm run db:seed
# 默认管理员账号：admin / admin123

# 4. 启动后端（http://localhost:3000）
npm run dev:server

# 5. 启动 H5 前端（http://localhost:5173）
npm run dev:h5

# 6. 启动 Admin 前端（http://localhost:5174）
npm run dev:admin
```

### Docker MySQL（可选）

```bash
docker-compose up -d
# 然后将 .env 中 DATABASE_URL 改为：
# DATABASE_URL="mysql://root:mysql@localhost:3306/yiwutrade"
# 重新运行 npm run db:migrate
```

## 项目结构

```
InStuRecruitment/
├── packages/
│   ├── server/          # Express API + Prisma ORM
│   ├── h5/              # 留学生报名 H5 页
│   └── admin/           # 后台管理 PC 页
├── docs/
│   ├── prd-v1.0.md      # 产品需求文档
│   ├── dev-plan-v1.0.md # 项目开发计划
│   └── assets/          # Logo、设计稿等静态资源
├── docker-compose.yml   # 本地 MySQL
├── CLAUDE.md            # 开发宪章
└── Requirements.md      # 原始需求
```

## 文档

- [产品需求文档 (PRD)](docs/prd-v1.0.md)
- [项目开发计划](docs/dev-plan-v1.0.md)

## 默认账号

| 角色 | 用户名 | 密码 |
|------|--------|------|
| 管理员 | admin | admin123 |

> ⚠️ 首次登录后请修改密码。

## License

Private — YiwuTrade
