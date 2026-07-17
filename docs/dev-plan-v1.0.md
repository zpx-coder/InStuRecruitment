# 留学生招聘报名系统 v1.0 — 项目开发计划

> **版本**：v1.0  
> **创建日期**：2026-07-17  
> **依据文档**：[PRD v1.0](prd-v1.0.md)

---

## 目录

1. [项目概况](#一项目概况)
2. [技术栈与工具链](#二技术栈与工具链)
3. [项目初始化](#三项目初始化)
4. [Phase 1：数据库与后端基础](#四phase-1数据库与后端基础)
5. [Phase 2：后端 API 完整开发](#五phase-2后端-api-完整开发)
6. [Phase 3：H5 留学生报名端](#六phase-3h5-留学生报名端)
7. [Phase 4：Admin 后台管理端](#七phase-4admin-后台管理端)
8. [Phase 5：联调、部署与上线](#八phase-5联调部署与上线)
9. [总览时间线](#九总览时间线)
10. [风险与应对](#十风险与应对)

---

## 一、项目概况

| 项 | 内容 |
|----|------|
| 项目名称 | International Students Recruitment（YiwuTrade） |
| 项目类型 | 留学生招聘报名系统 |
| 交付物 | H5 报名页（英文）+ Admin 后台（中文）+ 后端 API + 数据库 |
| 部署环境 | 开发：本地 Docker Compose；生产：阿里云 ECS + RDS PostgreSQL |

### 1.1 系统架构图

```
┌─────────────────────────────────────────────────────────┐
│                      用户层                              │
│   📱 留学生 H5（移动端）       🖥️ 管理员 PC（桌面端）    │
│      Vue 3 + Vant UI             Vue 3 + Element Plus   │
└──────────────┬──────────────────────┬───────────────────┘
               │  HTTP/REST           │  HTTP/REST + JWT
               ▼                      ▼
┌─────────────────────────────────────────────────────────┐
│                    Express.js API 层                     │
│  POST /api/applications    GET /api/applications         │
│  POST /api/auth/login      GET /api/applications/export  │
│  GET  /api/dict/options    GET /api/applications/:id     │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              PostgreSQL 数据库                           │
│   ┌──────────────┐       ┌──────────────┐               │
│   │ applications │       │   admins     │               │
│   └──────────────┘       └──────────────┘               │
└─────────────────────────────────────────────────────────┘
```

---

## 二、技术栈与工具链

| 层级 | 选型 | 版本要求 |
|------|------|----------|
| 运行时 | Node.js | ≥ 18 LTS |
| H5 前端 | Vue 3 + Vite + Vant 4 | Vue 3.x |
| Admin 前端 | Vue 3 + Vite + Element Plus | Vue 3.x |
| 后端框架 | Express.js | 4.x |
| ORM | Prisma | 5.x |
| 数据库 | PostgreSQL | 15+ |
| 鉴权 | JWT（jsonwebtoken） | — |
| 密码加密 | bcrypt | — |
| 数据加密 | Node.js crypto（AES-256-CBC） | 内置模块 |
| Excel 导出 | exceljs | 4.x |
| 表单校验（后端） | zod | 3.x |
| 开发环境 | Docker Compose（PostgreSQL） | — |
| 生产部署 | 阿里云 ECS + RDS PostgreSQL | — |

---

## 三、项目初始化

### 3.1 目录结构

```
InStuRecruitment/
├── packages/
│   ├── server/                    # 后端服务
│   │   ├── src/
│   │   │   ├── index.ts           # 入口
│   │   │   ├── app.ts             # Express 应用配置
│   │   │   ├── config/            # 环境变量、数据库配置
│   │   │   ├── middleware/        # auth、cors、rate-limit、error-handler
│   │   │   ├── routes/            # 路由定义
│   │   │   ├── controllers/       # 请求处理
│   │   │   ├── services/          # 业务逻辑
│   │   │   ├── validators/        # zod schema
│   │   │   └── utils/             # 加密、Excel 生成等工具
│   │   ├── prisma/
│   │   │   ├── schema.prisma      # 数据模型
│   │   │   └── seed.ts            # 初始数据（管理员账号）
│   │   ├── package.json
│   │   └── .env.example           # 环境变量模板
│   │
│   ├── h5/                        # 留学生 H5 前端
│   │   ├── src/
│   │   │   ├── App.vue
│   │   │   ├── main.ts
│   │   │   ├── views/             # 页面
│   │   │   ├── components/        # 表单区块、弹窗等组件
│   │   │   ├── composables/       # 表单校验、API 请求等
│   │   │   ├── styles/            # 全局样式、变量
│   │   │   └── api/               # axios 封装
│   │   ├── vite.config.ts
│   │   └── package.json
│   │
│   └── admin/                     # 后台管理前端
│       ├── src/
│       │   ├── App.vue
│       │   ├── main.ts
│       │   ├── views/             # 登录页、列表页
│       │   ├── components/        # 筛选栏、表格、导出按钮等
│       │   ├── composables/       # 鉴权、API 请求等
│       │   ├── styles/
│       │   ├── router/            # 路由配置
│       │   └── api/               # axios 封装
│       ├── vite.config.ts
│       └── package.json
│
├── docker-compose.yml             # 本地 PostgreSQL
├── docs/
│   ├── prd-v1.0.md
│   ├── dev-plan-v1.0.md           # 本文件
│   └── assets/
│       └── APP logo.jpg
├── CLAUDE.md
├── Requirements.md
└── README.md
```

### 3.2 初始化任务清单

| # | 任务 | 预估工时 | 产出 |
|---|------|----------|------|
| 0.1 | 创建 Monorepo 根目录，初始化 `package.json`、`.gitignore`、`.editorconfig` | 0.5h | 项目骨架 |
| 0.2 | 编写 `docker-compose.yml`（PostgreSQL 15），启动本地数据库 | 0.5h | 本地 DB 可用 |
| 0.3 | 初始化 `packages/server`，安装 Express/Prisma/zod/bcrypt/jsonwebtoken/exceljs | 0.5h | Server 骨架 |
| 0.4 | 初始化 `packages/h5`（Vue 3 + Vite + Vant 4），配置移动端适配 | 0.5h | H5 骨架 |
| 0.5 | 初始化 `packages/admin`（Vue 3 + Vite + Element Plus），配置路由 | 0.5h | Admin 骨架 |
| 0.6 | 编写 `README.md`（本地启动说明） | 0.5h | 文档 |

> **初始化预估**：3h

---

## 四、Phase 1：数据库与后端基础

### 4.1 任务列表

| # | 任务 | 预估工时 | 前置依赖 |
|---|------|----------|----------|
| 1.1 | 编写 Prisma Schema（`applications` + `admins` 两张表，含索引） | 1h | 0.3 |
| 1.2 | 执行 `prisma migrate` 建表 | 0.5h | 0.2, 1.1 |
| 1.3 | 编写 `prisma/seed.ts`（初始化管理员账号，bcrypt 加密密码） | 0.5h | 1.2 |
| 1.4 | 实现环境变量配置（数据库连接、JWT Secret、护照加密密钥、端口等） | 0.5h | 0.3 |
| 1.5 | 实现 Express 基础中间件（cors、json-parser、error-handler、rate-limit） | 1h | 0.3 |
| 1.6 | 实现护照号 AES-256-CBC 加解密工具（`utils/crypto.ts`） | 1h | 1.4 |

> **Phase 1 预估**：4.5h

### 4.2 Prisma Schema 关键定义

```prisma
model Application {
  id                    String   @id @default(uuid()) @db.Uuid
  name                  String   @db.VarChar(60)
  gender                String   @db.VarChar(20)
  phone                 String   @db.VarChar(20)
  email                 String   @db.VarChar(100)
  nationality           String   @db.VarChar(50)
  birthday              DateTime @db.Date
  passportNumber        String   @db.VarChar(200)  // AES 加密后存储
  proficientLanguages   Json     @db.JsonB
  hskLevel              String   @db.VarChar(10)
  englishProficiency    String   @db.VarChar(30)
  university            String   @db.VarChar(100)
  major                 String   @db.VarChar(80)
  highestDegree         String   @db.VarChar(30)
  currentAcademicYear   String   @db.VarChar(20)
  graduationDate        DateTime @db.Date
  postGraduationPlan    String   @db.VarChar(40)
  intendedCity          String   @db.VarChar(80)
  familyBusiness        String   @db.Text
  createdAt             DateTime @default(now()) @db.Timestamptz
  updatedAt             DateTime @updatedAt @db.Timestamptz

  @@index([nationality])
  @@index([highestDegree])
  @@index([hskLevel])
  @@index([intendedCity])
  @@index([createdAt(sort: Desc)])
}

model Admin {
  id           String   @id @default(uuid()) @db.Uuid
  username     String   @unique @db.VarChar(50)
  passwordHash String   @db.VarChar(255)
  createdAt    DateTime @default(now()) @db.Timestamptz
}
```

### 4.3 环境变量清单

```bash
# .env.example
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/yiwutrade
JWT_SECRET=<random-string>
JWT_EXPIRES_IN=86400
PASSPORT_ENCRYPTION_KEY=<32-char-hex>
PORT=3000
CORS_ORIGIN=http://localhost:5173,http://localhost:5174
```

---

## 五、Phase 2：后端 API 完整开发

### 5.1 任务列表

| # | 任务 | 预估工时 | 前置依赖 |
|---|------|----------|----------|
| 2.1 | 实现 zod 校验 schema（18 字段 + 枚举值约束） | 1.5h | 1.1 |
| 2.2 | 实现 `POST /api/applications`（提交报名，含校验 + 护照加密入库） | 1.5h | 2.1, 1.6 |
| 2.3 | 实现 `POST /api/auth/login`（用户名密码校验，返回 JWT） | 1h | 1.3 |
| 2.4 | 实现 JWT 鉴权中间件 | 0.5h | 1.4 |
| 2.5 | 实现 `GET /api/applications`（分页 + 多字段筛选，含 Prisma 动态查询） | 2h | 2.4, 1.2 |
| 2.6 | 实现 `GET /api/applications/:id`（单条详情） | 0.5h | 2.4 |
| 2.7 | 实现 `GET /api/applications/export`（Excel 导出，exceljs 生成 .xlsx） | 1.5h | 2.5 |
| 2.8 | 实现 `GET /api/dict/options`（返回所有枚举选项 JSON） | 0.5h | — |
| 2.9 | 编写后端接口集成测试（至少覆盖提交、登录、列表查询、导出） | 2h | 2.2-2.8 |

> **Phase 2 预估**：11h

### 5.2 API 路由汇总

```
POST   /api/applications          → 提交报名（公开）
POST   /api/auth/login            → 管理员登录（公开）
GET    /api/auth/me               → 获取当前登录用户信息（JWT）
GET    /api/applications          → 报名列表（JWT，分页+筛选）
GET    /api/applications/:id      → 报名详情（JWT）
GET    /api/applications/export   → 导出 Excel（JWT）
GET    /api/dict/options          → 枚举选项字典（公开）
```

### 5.3 筛选参数设计

| 参数 | 类型 | 查询方式 |
|------|------|----------|
| `page` | int | 分页页码，默认 1 |
| `per_page` | int | 每页条数，默认 20，最大 100 |
| `nationality` | string | `contains`（模糊） |
| `highest_degree` | string | 精确匹配（多值逗号分隔） |
| `hsk_level` | string | 精确匹配（多值逗号分隔） |
| `intended_city` | string | `contains`（模糊） |
| `name` | string | `contains`（模糊） |
| `university` | string | `contains`（模糊） |
| `proficient_languages` | string | JSONB `?|` 包含任一 |
| `english_proficiency` | string | 精确匹配（多值逗号分隔） |
| `post_graduation_plan` | string | 精确匹配（多值逗号分隔） |

---

## 六、Phase 3：H5 留学生报名端

### 6.1 页面组件树

```
App.vue
└── RegistrationView.vue  （长滚动单页，区块交替背景 #fafafa / #f0f1f4）
    ├── BannerSection.vue          ← 品牌红渐变背景 + Logo + 活动名 + 粒子动效
    ├── PersonalInfoSection.vue    ← 白色卡片 + 左侧红条，7 字段
    ├── LanguagesSection.vue       ← 白色卡片，3 字段
    ├── EducationSection.vue       ← 白色卡片，5 字段
    ├── CareerBackgroundSection.vue ← 白色卡片，3 字段
    ├── PrivacyConsent.vue         ← 隐私同意勾选框
    ├── SubmitButton.vue           ← 全宽品牌红按钮 + Loading + 成功弹窗
    └── FooterSection.vue          ← 深色背景 #1a1a1a，Privacy + Copyright
```

### 6.2 任务列表

| # | 任务 | 预估工时 | 前置依赖 |
|---|------|----------|----------|
| 3.1 | 全局样式与主题配置（品牌色 `#d00000`、字体层级、CSS 变量、区块交替背景 `#f0f1f4`/`#ffffff`） | 1h | 0.4 |
| 3.2 | 移动端适配（viewport、rem 方案、安全区域、卡片圆角 16px、阴影系统） | 0.5h | 0.4 |
| 3.3 | `BannerSection` — Logo + 品牌红渐变背景 + 几何粒子动效 + 活动名称 "International Students Recruitment"，高度 ~400px | 1.5h | 3.1 |
| 3.4 | `api/` 层封装（axios 实例、`submitApplication`、`fetchDictOptions`） | 0.5h | 0.4 |
| 3.5 | `useFormValidation` composable（18 字段前端校验规则 + 滚动至首错字段） | 2h | — |
| 3.6 | `PersonalInfoSection`（白色卡片 + 左侧 4px 品牌红竖条，7 字段表单 + 日期选择器 + 国家文本输入） | 2h | 3.2, 3.5 |
| 3.7 | `LanguagesSection`（白色卡片布局，多选 + HSK 单选 + 英语单选） | 1.5h | 3.2, 3.5 |
| 3.8 | `EducationSection`（白色卡片布局，5 字段 + 学历单选 + 年级单选 + 日期选择器） | 1.5h | 3.2, 3.5 |
| 3.9 | `CareerBackgroundSection`（白色卡片布局，3 字段 + 计划单选 + textarea 5-500 字符计数器） | 1h | 3.2, 3.5 |
| 3.10 | `PrivacyConsent` + `SubmitButton`（勾选 + 提交 loading + 成功弹窗居中白色卡片 + 绿色勾选动画） | 1.5h | 3.4 |
| 3.11 | 页面入场动画 + 区块淡入上移 + Banner 视差 + 输入聚焦动效 + 校验抖动（6 项动效，参考 H5UI.png 节奏） | 2h | 3.3-3.10 |
| 3.12 | 表单字段字典数据加载（`/api/dict/options`）+ Loading 骨架屏 | 0.5h | 3.4, 2.8 |
| 3.13 | `FooterSection` — 深色背景 `#1a1a1a`，Privacy Notice + Copyright © 2026 YiwuTrade | 1h | 3.1 |
| 3.14 | H5 端联调测试（真实提交 + 错误场景 + 移动端兼容测试 iOS Safari/Android Chrome/微信） | 2h | 2.2, 3.13 |

> **Phase 3 预估**：19.5h

### 6.3 关键交互细节

- Banner 区：品牌 Logo + "International Students Recruitment" + 视觉背景（渐变红色系）
- 表单区块间用卡片分隔，每张卡片左侧色条（`#d00000` 4px）
- 全部 18 字段必填，提交时滚动至第一个错误字段
- 提交按钮：全宽、品牌红、16px 圆角
- 成功弹窗：居中白色卡片 + 绿色勾选动画 + 文案

---

## 七、Phase 4：Admin 后台管理端

### 7.1 页面路由

```
/               → 重定向到 /login 或 /applications
/login          → LoginView.vue
/applications   → ApplicationList.vue（需登录）
```

### 7.2 任务列表

| # | 任务 | 预估工时 | 前置依赖 |
|---|------|----------|----------|
| 4.1 | Admin 全局样式 + Element Plus 主题定制（品牌红 `#d00000`） | 1h | 0.5 |
| 4.2 | 路由配置（`/login` + `/applications`）+ 路由守卫（未登录跳转） | 0.5h | 0.5 |
| 4.3 | `api/` 层封装（axios 实例 + JWT 拦截器 + 自动刷新/过期跳转） | 1h | 0.5 |
| 4.4 | `useAuth` composable（登录/登出/Token 管理/记住我） | 1h | 4.3 |
| 4.5 | `LoginView`（用户名密码表单 + 记住我 + 登录错误提示） | 1.5h | 4.2, 4.4 |
| 4.6 | `ApplicationList` — 表格组件（18 字段列，默认显示核心 8 列） | 2h | 4.3, 2.5 |
| 4.7 | `FilterBar` — 快捷筛选 4 字段（国籍/学历/HSK/城市） | 1.5h | 2.5 |
| 4.8 | `FilterBar` — 展开筛选 5 字段（姓名/大学/语言/英语/计划） | 1h | 2.5 |
| 4.9 | 分页组件 + 筛选条件 URL query 同步 | 1h | 4.6, 4.7 |
| 4.10 | `DetailDrawer` — 点击行展开查看全部 18 字段详情 | 1.5h | 2.6 |
| 4.11 | Excel 导出按钮（触发下载流文件） | 1h | 2.7 |
| 4.12 | 顶部导航栏（Logo + 用户名 + 退出按钮） | 1h | 4.4 |
| 4.13 | Admin 端联调测试（登录/列表/筛选/导出/详情/退出） | 2h | 全部 |

> **Phase 4 预估**：16h

### 7.3 管理列表默认列

| 列 | 字段 | 宽度 |
|----|------|------|
| # | 序号 | 60px |
| 姓名 | `name` | 120px |
| 国籍 | `nationality` | 100px |
| 学历 | `highest_degree` | 100px |
| 大学 | `university` | 160px |
| HSK | `hsk_level` | 80px |
| 意向城市 | `intended_city` | 120px |
| 提交时间 | `created_at` | 160px |

---

## 八、Phase 5：联调、部署与上线

### 8.1 任务列表

| # | 任务 | 预估工时 | 前置依赖 |
|---|------|----------|----------|
| 5.1 | 全链路联调（H5 提交 → 后端入库 → Admin 查看/筛选/导出） | 2h | Phase 3+4 |
| 5.2 | 边界场景测试（表单重复提交、XSS 输入、异常网络、空数据） | 1.5h | 5.1 |
| 5.3 | 移动端兼容性测试（iOS Safari / Android Chrome / 微信浏览器） | 1h | 5.1 |
| 5.4 | 编写 Dockerfile（server 生产构建） | 0.5h | — |
| 5.5 | 阿里云 ECS 环境搭建（Node.js + Nginx 反向代理 + HTTPS） | 2h | 5.4 |
| 5.6 | 阿里云 RDS PostgreSQL 创建 + 安全组配置 + 数据库迁移 | 1h | 1.2 |
| 5.7 | 生产环境变量配置（JWT Secret、护照加密密钥、管理员密码等） | 0.5h | 5.5 |
| 5.8 | 前端生产构建 + 部署至 Nginx（H5 + Admin 静态资源） | 1h | 5.5 |
| 5.9 | 生产冒烟测试（H5 提交 → Admin 登录 → 查看/导出） | 1h | 5.7, 5.8 |

> **Phase 5 预估**：10.5h

---

## 九、总览时间线

### 9.1 阶段汇总

| 阶段 | 内容 | 预估工时 | 累计 |
|------|------|----------|------|
| Phase 0 | 项目初始化 | 3h | 3h |
| Phase 1 | 数据库与后端基础 | 4.5h | 7.5h |
| Phase 2 | 后端 API 完整开发 | 11h | 18.5h |
| Phase 3 | H5 留学生报名端 | 19.5h | 38h |
| Phase 4 | Admin 后台管理端 | 16h | 54h |
| Phase 5 | 联调、部署与上线 | 10.5h | **64.5h** |

### 9.2 推荐执行顺序

```
Phase 0  ──▶  Phase 1  ──▶  Phase 2  ──▶  Phase 3  ──▶  Phase 5
 初始化        数据库&基础     API开发    ──▶  Phase 4      联调上线
                                        H5 & Admin 可并行
```

- Phase 0-2 串行执行（基础设施依赖）
- **Phase 3 和 Phase 4 可并行开发**（共享 API 层，前后端分离）
- Phase 5 需 Phase 3+4 都完成后执行

### 9.3 里程碑对照

| 里程碑 | 对应 Phase | 交付标准 |
|--------|-----------|----------|
| M1 — 开发环境就绪 | Phase 0 | 本地 `docker-compose up` + 三个服务可启动 |
| M2 — API 就绪 | Phase 1+2 | Postman 可调通全部 7 个接口 |
| M3 — H5 可访问 | Phase 3 | 手机扫码可打开报名页并成功提交 |
| M4 — Admin 可访问 | Phase 4 | 电脑可登录后台，查看/筛选/导出数据 |
| M5 — 生产上线 | Phase 5 | 公网域名可访问 H5 + Admin，数据正常流通 |

---

## 十、风险与应对

| 风险 | 概率 | 影响 | 应对措施 |
|------|------|------|----------|
| 护照号加密实现复杂度超预期 | 低 | 中 | 使用 Node.js 内置 `crypto` 模块，AES-256-CBC 为标准方案，有成熟代码参考 |
| 移动端 H5 兼容性问题 | 中 | 中 | Phase 3 完成后增加 1h 专项兼容测试；Vant UI 本身已做移动端适配 |
| 阿里云 RDS 网络/权限配置问题 | 中 | 中 | 提前查看阿里云文档，安全组白名单放通 ECS IP |
| 表单 18 字段全必填导致提交率低 | 低 | 低 | 产品层面已确认；后续可根据数据反馈调整 |
| 无登录态报名被滥用（刷数据） | 中 | 低 | 已实现 Rate Limiting（单 IP 每小时 10 次）；可后续加验证码 |

---

## 附录：开发环境一键启动命令（目标）

```bash
# 1. 启动数据库
docker-compose up -d

# 2. 初始化后端
cd packages/server
cp .env.example .env    # 填入实际配置
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev              # → http://localhost:3000

# 3. 启动 H5 前端
cd packages/h5
npm install
npm run dev              # → http://localhost:5173

# 4. 启动 Admin 前端
cd packages/admin
npm install
npm run dev              # → http://localhost:5174
```

---

> **文档版本**：v1.0  
> **最后更新**：2026-07-17  
> **下一步**：确认计划后，按 Phase 0 → 1 → 2 → 3 & 4（并行）→ 5 顺序执行
