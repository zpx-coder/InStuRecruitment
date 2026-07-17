# 留学生招聘报名系统 v1.0 — 产品需求文档（PRD）

> **版本**：v1.0  
> **状态**：草稿  
> **创建日期**：2026-07-17  
> **作者**：产品团队  

---

## 目录

1. [产品概述](#一产品概述)
2. [用户故事](#二用户故事)
3. [功能需求](#三功能需求)
   - [3.1 留学生 H5 报名端](#31-留学生-h5-报名端)
   - [3.2 后台管理端](#32-后台管理端)
4. [数据模型](#四数据模型)
5. [API 接口设计](#五api-接口设计)
6. [非功能性需求](#六非功能性需求)
7. [UI/UX 设计指引](#七uiux-设计指引)
8. [技术方案概要](#八技术方案概要)
9. [里程碑与交付物](#九里程碑与交付物)

---

## 一、产品概述

### 1.1 产品定位

留学生招聘报名系统是一款面向外国在华留学生的轻量级招聘报名工具。留学生通过移动端 H5 页面提交个人简历与求职意向，招聘方在 PC 后台查看、筛选和导出报名数据。

### 1.2 目标用户

| 角色 | 描述 | 使用端 |
|------|------|--------|
| 外国留学生 | 在华留学、有求职意向的国际学生 | 移动端 H5（英文） |
| 招聘管理员 | 负责收集、筛选、跟进报名信息的工作人员 | PC 后台（中文） |

### 1.3 核心价值

- **对留学生**：便捷、精美的一站式报名体验，无需注册即可提交求职信息
- **对管理员**：集中管理报名数据，支持筛选与导出，提升人才匹配效率

### 1.4 活动主题

| 项目 | 内容 |
|------|------|
| 活动名称 | **International Students Recruitment** |
| 品牌名 | **YiwuTrade** |
| 品牌 Logo | `docs/assets/APP logo.jpg`（35KB，1024×1024），Banner 区展示 Logo + 活动名称 |
| 品牌主色 | **`#d00000`**（取自 Logo 主色，纯正红色） |

---

## 二、用户故事

### 2.1 留学生端

| ID | 用户故事 | 优先级 |
|----|----------|--------|
| US-01 | 作为一名外国留学生，我希望打开一个精美的报名页面，能直观感受到这是一个招聘活动 | P0 |
| US-02 | 作为一名外国留学生，我希望填写个人基本信息（姓名、性别、出生日期等），无需登录即可开始 | P0 |
| US-03 | 作为一名外国留学生，我希望填写教育背景（学历、大学、专业、学业年份、毕业时间等） | P0 |
| US-04 | 作为一名外国留学生，我希望填写语言能力（精通语言、HSK 等级、英语水平） | P0 |
| US-05 | 作为一名外国留学生，我希望提交前能看到哪些字段漏填或填错，获得即时校验反馈 | P0 |
| US-06 | 作为一名外国留学生，我希望提交成功后看到明确反馈，知晓后续流程 | P0 |

### 2.2 管理员端

| ID | 用户故事 | 优先级 |
|----|----------|--------|
| US-07 | 作为一名管理员，我希望通过账号密码登录后台，保障数据安全 | P0 |
| US-08 | 作为一名管理员，我希望在列表中查看所有留学生提交的报名信息 | P0 |
| US-09 | 作为一名管理员，我希望按国籍、学历、大学、语言等维度筛选数据，快速定位目标候选人 | P0 |
| US-10 | 作为一名管理员，我希望将报名数据导出为 Excel 文件，便于线下分析和分享 | P0 |

---

## 三、功能需求

### 3.1 留学生 H5 报名端

#### 3.1.1 页面结构

页面采用单页滚动式布局，自上而下分为以下区域：

```
┌──────────────────────────────┐
│     YiwuTrade Logo + 主题头图 Banner     │  ← International Students Recruitment
├──────────────────────────────┤
│   个人信息 (Personal Info)    │  ← 姓名/性别/手机/邮箱/国籍/生日/护照号
├──────────────────────────────┤
│   语言能力 (Languages)        │  ← 精通语言/HSK 等级/英语水平
├──────────────────────────────┤
│   教育背景 (Education)        │  ← 学历/大学/专业/当前年级/毕业时间
├──────────────────────────────┤
│   职业与背景 (Career & BG)    │  ← 毕业后计划/意向城市/家庭经营行业
├──────────────────────────────┤
│      [ 提交报名 Submit ]      │  ← 提交按钮
└──────────────────────────────┘
```

#### 3.1.2 表单字段定义

##### 个人信息（Personal Information）

| # | 字段名（英） | 字段名（中） | 控件类型 | 是否必填 | 校验规则 |
|---|-------------|-------------|----------|----------|----------|
| 1 | Name | 姓名 | 文本输入 | ✅ 必填 | 2-60 字符 |
| 2 | Gender | 性别 | 单选 | ✅ 必填 | Male / Female / Prefer not to say |
| 3 | Phone Number | 手机号 | 文本输入 | ✅ 必填 | 中国大陆手机号格式校验（11 位），或国际号码格式 |
| 4 | Email | 邮箱 | 文本输入 | ✅ 必填 | 标准邮箱格式校验 |
| 5 | Nationality | 国籍 | 文本输入 | ✅ 必填 | 2-50 字符，自由输入不限定范围 |
| 6 | Birthday | 出生日期 | 日期选择 | ✅ 必填 | 年龄 ≥ 16 岁，≤ 60 岁 |
| 7 | Passport Number | 护照号码 | 文本输入 | ✅ 必填 | 6-20 字符，字母数字组合 |

##### 语言能力（Languages）

| # | 字段名（英） | 字段名（中） | 控件类型 | 是否必填 | 校验规则 |
|---|-------------|-------------|----------|----------|----------|
| 8 | Proficient Languages | 精通语言 | 多选 | ✅ 必填 | Chinese / English / Korean / Japanese / French / German / Spanish / Arabic / Russian / Other（至少选一项） |
| 9 | HSK Level | 中文 HSK 等级 | 单选 | ✅ 必填 | HSK 1 / HSK 2 / HSK 3 / HSK 4 / HSK 5 / HSK 6 / HSK 7 / HSK 8 / HSK 9 |
| 10 | English Proficiency | 英语水平 | 单选 | ✅ 必填 | Zero foundation（零基础）/ Basic daily conversation（基础日常交流）/ Fluent communication（流利沟通）/ Business proficient（商务精通） |

##### 教育背景（Education Background）

| # | 字段名（英） | 字段名（中） | 控件类型 | 是否必填 | 校验规则 |
|---|-------------|-------------|----------|----------|----------|
| 11 | University | 就读大学 | 文本输入 | ✅ 必填 | 2-100 字符 |
| 12 | Major | 专业 | 文本输入 | ✅ 必填 | 2-80 字符 |
| 13 | Highest Degree | 最高学历 | 单选 | ✅ 必填 | High School / Associate / Bachelor's / Master's / PhD / Other |
| 14 | Current Academic Year | 当前年级 | 单选 | ✅ 必填 | Year 1 / Year 2 / Year 3 / Year 4 / Year 5 / Master Year 1 / Master Year 2 / Master Year 3 / PhD Year 1 / PhD Year 2 / PhD Year 3 / PhD Year 4+ / Other |
| 15 | Graduation Date | 毕业时间 | 日期选择 | ✅ 必填 | 允许未来日期（预计毕业时间） |

##### 职业意向与背景（Career & Background）

| # | 字段名（英） | 字段名（中） | 控件类型 | 是否必填 | 校验规则 |
|---|-------------|-------------|----------|----------|----------|
| 16 | Post-graduation Plan | 毕业后计划 | 单选 | ✅ 必填 | Pursue further studies（继续深造学业）/ Internship & Part-time job（实习兼职）/ Full-time job（全职）/ Set a company（创立公司） |
| 17 | Intended City for Employment/Company | 意向就业城市/公司 | 文本输入 | ✅ 必填 | 2-80 字符，可输入城市名或具体公司名称 |
| 18 | Family Business/Target Products | 家庭经营行业/意向产品 | 多行文本 | ✅ 必填 | 5-500 字符，描述家庭从事的行业或希望对接的产品方向 |

> **全部 18 个字段均为必填**，任一字段未填写或校验不通过，提交时阻止并给出对应提示。

#### 3.1.3 交互动效

| 动效 | 触发场景 | 描述 |
|------|----------|------|
| 页面入场 | 页面加载 | 各区块依次淡入上移（fade-in + slide-up），头部 Banner 优先出现 |
| 输入聚焦 | 点击表单控件 | 输入框边框高亮 + 微阴影，标签文字上浮动，平滑过渡 |
| 校验反馈 | 提交时字段校验失败 | 错误字段边框变红 + 抖动（shake），下方显示红色提示文字 |
| 按钮悬停 | 手指/鼠标悬停提交按钮 | 按钮轻微放大（scale 1.02）+ 颜色加深 |
| 按钮加载 | 点击提交后 | 按钮显示 loading 动画，文字变为 "Submitting..."，按钮置灰不可重复点击 |
| 成功弹窗 | 提交成功 | 从页面中央弹出成功卡片，含勾选动画图标 + 提示文案，背景半透明遮罩 |
| 滚动视差 | 页面滚动 | Banner 区域轻微视差效果，滚动时 Banner 移动速度慢于表单区域 |

#### 3.1.4 提交流程

```
用户点击 Submit
    │
    ▼
前端表单校验 ──失败──▶ 显示字段错误（动效反馈），滚动至第一个错误字段
    │
    │ 通过
    ▼
按钮进入 Loading 状态
    │
    ▼
POST /api/applications ──失败──▶ 提示 "Network error, please try again"
    │
    │ 成功
    ▼
弹出成功弹窗：
  ✅ "Submitted successfully!
      Our staff will contact you once a matching position is found."
    │
    ▼
点击 "OK" 关闭弹窗 → 表单重置（如需要可再次提交）
```

#### 3.1.5 设计约束

- 语言：**全英文**
- 适配：移动端优先，宽度 320px - 428px，最大宽度 768px 居中
- 主题色：`#d00000`（取自品牌 Logo YiwuTrade 主色）
- 字体：系统默认字体栈（优先使用平台原生字体，确保加载速度）
- 图片：Banner 主题图待提供，PRD 阶段标记为占位

---

### 3.2 后台管理端

#### 3.2.1 登录页

```
┌──────────────────────────────────┐
│                                  │
│           YiwuTrade Logo          │
│   International Students Recruitment  │
│         留学生招聘管理系统          │
│                                  │
│   ┌──────────────────────────┐   │
│   │  用户名                   │   │
│   ├──────────────────────────┤   │
│   │  密码                     │   │
│   ├──────────────────────────┤   │
│   │         [ 登 录 ]        │   │
│   └──────────────────────────┘   │
│                                  │
└──────────────────────────────────┘
```

- 语言：**中文**
- 鉴权方式：单管理员账号（用户名 + 密码），账号通过环境变量或数据库初始化脚本预设，**不需要注册流程**
- 登录成功后颁发 JWT Token，有效期 24 小时
- 登录失败显示错误提示："用户名或密码错误"
- 支持"记住我"功能（7 天免登录）

#### 3.2.2 留学生管理列表

```
┌──────────────────────────────────────────────────────────────────┐
│  YiwuTrade — 留学生招聘管理系统              [用户名] [退出]    │
├──────────────────────────────────────────────────────────────────┤
│  ┌────────┬──────────┬──────────┬──────────┬────────────────┐  │
│  │ 国籍 ▼ │ 学历  ▼  │ HSK  ▼   │ 城市 🔍  │  [搜索] [重置] │  │
│  └────────┴──────────┴──────────┴──────────┴────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 展开筛选 ▸  姓名 | 大学 | 语言 | 英语水平 | 毕业后计划      │  │
│  └──────────────────────────────────────────────────────────┘  │
│  [导出 Excel]                              共 N 条记录         │
├──────────────────────────────────────────────────────────────────┤
│  # │ 姓名 │ 国籍 │ 学历 │ 大学 │ 专业 │ HSK │ 意向城市 │ ...  │
│ ──┼──────┼──────┼──────┼──────┼──────┼─────┼──────────┼───── │
│  1 │ ...  │ ...  │ ...  │ ...  │ ...  │ ... │ ...      │ ...  │
│  2 │ ...  │ ...  │ ...  │ ...  │ ...  │ ... │ ...      │ ...  │
│ ...                                                             │
├──────────────────────────────────────────────────────────────────┤
│                   <  1  2  3  ...  10  >                        │
└──────────────────────────────────────────────────────────────────┘
```

**核心交互规则：**

- 列表默认按提交时间倒序排列（最新在前）
- 每页显示 20 条记录，支持分页
- 点击某一行可展开查看该留学生的完整信息（抽屉或展开行）
- 列表支持响应式，最小宽度 1024px

#### 3.2.3 筛选搜索

##### 快捷筛选（始终可见）

| 筛选字段 | 控件类型 | 说明 |
|----------|----------|------|
| 国籍 (Nationality) | 文本输入 | 模糊匹配，用户自由输入 |
| 学历 (Highest Degree) | 下拉多选 | High School / Associate / Bachelor's / Master's / PhD / Other |
| HSK 等级 (HSK Level) | 下拉多选 | HSK 1-9 |
| 意向城市 (Intended City) | 文本输入 | 模糊匹配 |

##### 展开筛选（点击展开后可见）

| 筛选字段 | 控件类型 | 说明 |
|----------|----------|------|
| 姓名 (Name) | 文本输入 | 模糊匹配 |
| 就读大学 (University) | 文本输入 | 模糊匹配 |
| 精通语言 (Proficient Languages) | 下拉多选 | Chinese / English / Korean / Japanese / Others |
| 英语水平 (English Proficiency) | 下拉多选 | Zero / Basic / Fluent / Business |
| 毕业后计划 (Post-graduation Plan) | 下拉多选 | Further Studies / Internship / Full-time / Set Company |

- 筛选条件可组合使用（AND 逻辑）
- 筛选条件变更后自动触发查询
- 支持"重置"按钮一键清空所有筛选条件
- 筛选状态在 URL query 中体现，支持分享链接

#### 3.2.4 Excel 导出

- 点击"导出 Excel"按钮，导出**当前筛选结果**的所有数据
- 导出格式：`.xlsx`
- 导出字段：所有 18 个表单字段 + 提交时间 + 记录 ID
- 文件名格式：`留学生报名数据_YYYY-MM-DD.xlsx`
- 导出数量无上限（若数据量 > 5000 条，后台异步生成并提供下载链接）

#### 3.2.5 设计约束

- 语言：**全中文**
- 适配：PC 端，最小支持 1024px 宽度，推荐 1440px
- UI 风格：简洁专业的企业后台风格
- 组件库：推荐 Element Plus（与 Vue 3 生态一致）

---

## 四、数据模型

### 4.1 留学生报名表 `applications`

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| `id` | UUID | PK, 自动生成 | 记录唯一标识 |
| `name` | VARCHAR(60) | NOT NULL | 姓名 |
| `gender` | VARCHAR(20) | NOT NULL | 性别：male / female / prefer_not_to_say |
| `phone` | VARCHAR(20) | NOT NULL | 手机号 |
| `email` | VARCHAR(100) | NOT NULL | 邮箱 |
| `nationality` | VARCHAR(50) | NOT NULL, 建索引 | 国籍 |
| `birthday` | DATE | NOT NULL | 出生日期 |
| `passport_number` | VARCHAR(30) | NOT NULL | 护照号码（敏感字段，加密存储） |
| `proficient_languages` | JSONB | NOT NULL | 精通语言（多选数组） |
| `hsk_level` | VARCHAR(10) | NOT NULL, 建索引 | HSK 等级：hsk1 - hsk9 |
| `english_proficiency` | VARCHAR(30) | NOT NULL | 英语水平：zero / basic / fluent / business |
| `university` | VARCHAR(100) | NOT NULL | 就读大学 |
| `major` | VARCHAR(80) | NOT NULL | 专业 |
| `highest_degree` | VARCHAR(30) | NOT NULL, 建索引 | 最高学历 |
| `current_academic_year` | VARCHAR(20) | NOT NULL | 当前年级 |
| `graduation_date` | DATE | NOT NULL | 毕业时间（含预计毕业） |
| `post_graduation_plan` | VARCHAR(40) | NOT NULL | 毕业后计划：further_studies / internship / full_time / set_company |
| `intended_city` | VARCHAR(80) | NOT NULL, 建索引 | 意向就业城市/公司 |
| `family_business` | TEXT | NOT NULL | 家庭经营行业/意向产品 |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 提交时间 |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | 更新时间 |

**索引设计：**
- 主键索引：`id`
- 查询索引：`nationality`, `highest_degree`, `hsk_level`, `intended_city`
- 排序索引：`created_at DESC`
- 模糊搜索（可选，使用 pg_trgm 扩展）：`name`, `university`

### 4.2 管理员账号表 `admins`

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| `id` | UUID | PK | 管理员 ID |
| `username` | VARCHAR(50) | UNIQUE, NOT NULL | 登录用户名 |
| `password_hash` | VARCHAR(255) | NOT NULL | bcrypt 加密后的密码 |
| `created_at` | TIMESTAMPTZ | NOT NULL | 创建时间 |

- 初始管理员账号通过数据库种子脚本（seed）创建
- 默认账号：`admin` / `admin123`（首次登录后建议修改密码）
- 密码使用 bcrypt 加盐哈希存储

---

## 五、API 接口设计

### 5.1 接口列表

| 方法 | 路径 | 说明 | 鉴权 |
|------|------|------|------|
| `POST` | `/api/applications` | 留学生提交报名 | ❌ 无 |
| `POST` | `/api/auth/login` | 管理员登录 | ❌ 无 |
| `GET` | `/api/applications` | 查询报名列表（分页+筛选） | ✅ JWT |
| `GET` | `/api/applications/:id` | 查看单条报名详情 | ✅ JWT |
| `GET` | `/api/applications/export` | 导出 Excel | ✅ JWT |
| `GET` | `/api/dict/options` | 获取表单枚举选项列表（性别、学历、HSK等级、英语水平、当前年级、毕业后计划、语言选项、薪资区间） | ❌ 无 |

### 5.2 主要接口详情

#### POST /api/applications — 提交报名

```json
// Request Body
{
  "name": "John Doe",
  "gender": "male",
  "phone": "13800138000",
  "email": "john@example.com",
  "nationality": "United States",
  "birthday": "1998-05-15",
  "passport_number": "AB1234567",
  "proficient_languages": ["chinese", "english"],
  "hsk_level": "hsk4",
  "english_proficiency": "fluent",
  "university": "Peking University",
  "major": "Computer Science",
  "highest_degree": "bachelor",
  "current_academic_year": "year_3",
  "graduation_date": "2027-06-30",
  "post_graduation_plan": "full_time",
  "intended_city": "Shanghai",
  "family_business": "Family runs an electronics components trading business, interested in expanding to consumer electronics market in Southeast Asia."
}

// Response 201
{
  "success": true,
  "message": "Application submitted successfully"
}

// Response 422 (Validation Error)
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Invalid email format" }
  ]
}
```

#### GET /api/applications — 查询列表

```
GET /api/applications?page=1&per_page=20&nationality=United+States&highest_degree=bachelor&hsk_level=hsk4&intended_city=Shanghai&name=John&university=Peking&proficient_languages=chinese&english_proficiency=fluent&post_graduation_plan=full_time
```

```json
// Response 200
{
  "success": true,
  "data": {
    "items": [ /* ... */ ],
    "pagination": {
      "page": 1,
      "per_page": 20,
      "total": 150,
      "total_pages": 8
    }
  }
}
```

#### POST /api/auth/login — 管理员登录

```json
// Request Body
{
  "username": "admin",
  "password": "xxxxxx"
}

// Response 200
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_in": 86400
}

// Response 401
{
  "success": false,
  "message": "用户名或密码错误"
}
```

---

## 六、非功能性需求

### 6.1 性能

| 指标 | 目标值 | 说明 |
|------|--------|------|
| H5 页面首屏加载 | ≤ 2s（4G 网络） | 图片懒加载 + 资源压缩 |
| 表单提交响应 | ≤ 3s | 含后端校验 + 入库 |
| 后台列表查询 | ≤ 1s（1000 条内） | 索引优化 + 分页 |
| Excel 导出 | ≤ 10s（5000 条内） | 超出 5000 条异步处理 |

### 6.2 安全

| 要求 | 说明 |
|------|------|
| JWT 鉴权 | 管理员接口全部校验 Token，过期需重新登录 |
| 密码加密 | bcrypt 加盐哈希，禁止明文存储 |
| SQL 注入防护 | 全部查询使用参数化，禁止字符串拼接 |
| XSS 防护 | 前端输出转义，后端入库前做 HTML 净化 |
| CORS | 仅允许配置的域名跨域访问 |
| Rate Limiting | 报名接口限制单 IP 每小时 10 次提交，防止滥用 |
| HTTPS | 生产环境强制 HTTPS |

### 6.3 浏览器兼容性

| 端 | 兼容范围 |
|----|----------|
| H5 移动端 | iOS Safari ≥ 14, Android Chrome ≥ 90, 微信内置浏览器 |
| PC 后台 | Chrome ≥ 90, Edge ≥ 90, Safari ≥ 14 |

### 6.4 数据合规

- 明确告知用户数据用途（报名匹配岗位），在表单页底部添加 Privacy Notice
- **护照号码为敏感个人身份信息**，数据库存储须 AES-256 加密，加密密钥通过环境变量 `PASSPORT_ENCRYPTION_KEY` 注入，不提交版本控制，日志中禁止明文输出
- 所有用户数据仅用于招聘匹配目的，不得用于其他用途
- 支持数据删除请求（管理员手动操作）
- 表单页需展示数据收集声明（Data Collection Statement），告知用户数据用途、存储方式及权利

### 6.5 新增隐私声明要求（因含护照号）

- H5 表单底部必须展示 Privacy Notice，内容包含：数据收集目的、数据存储期限、用户权利（查阅/更正/删除）
- 提交按钮上方增加 checkbox："I agree to the collection and processing of my personal data for recruitment matching purposes."（未勾选禁止提交）
- 护照号字段下方增加提示文案："Your passport number will be encrypted and used only for identity verification purposes."

---

## 七、UI/UX 设计指引

### 7.1 H5 报名端

**视觉风格**：基于设计参考稿 `docs/assets/H5UI.png`，采用现代简约长滚动单页布局，卡片式区块分隔，视觉节奏通过交替背景色实现，传递专业、可信赖的品牌感受。

**设计参考稿（H5UI.png）核心设计模式提取：**

| 设计要素 | 参考稿特征 | 本项目适配 |
|----------|-----------|-----------|
| 主色调 | 蓝色系（`#2060e0`） | 替换为品牌红 `#d00000` |
| 页面结构 | 长滚动单页，多区块交替背景 | 保留，5 大表单区块 + Banner + Footer |
| 区块分隔 | 白色/浅灰交替背景，区隔感明确 | 保留，`#fafafa` / `#ffffff` 交替 |
| 卡片样式 | 白色卡片 + 浅色背景区，圆角阴影 | 保留，卡片左侧品牌色条 4px |
| 内容节奏 | Banner → 简介区 → 卡片区 → 表单区 → CTA → Footer | 适配为：Banner → 4 组表单卡片区 → 隐私同意 → 提交 → Footer |
| 深色 Footer | 近黑色底色（`#020202`） | 保留，底部深色区放置 Privacy Notice + 版权信息 |

**配色方案（基于品牌 Logo 主色 `#d00000`）：**

| 用途 | 色值 | 说明 |
|------|------|------|
| 主色 | `#d00000` | 按钮、链接、聚焦边框、品牌强调 |
| 主色深 | `#a00000` | 按钮悬停/按下 |
| 主色浅 | `#ffe5e5` | 浅色背景、选中态底色 |
| 渐变辅助 | `#ff4444` | Banner 渐变、标签等辅助红色 |
| 成功 | `#0f9d58` | 成功图标 |
| 错误 | `#d93025` | 校验错误（注意与主色区分，错误使用偏橙红） |
| 页面背景 | `#fafafa` | 全局背景 |
| 区块交替背景 | `#f0f1f4` | 与白色卡片区交替，形成视觉节奏 |
| 卡片 | `#ffffff` | 表单卡片背景，圆角 16px，阴影 0 2px 12px rgba(0,0,0,0.06) |
| 文字主 | `#202124` | 标题、正文 |
| 文字辅 | `#5f6368` | 标签、提示 |
| Footer 背景 | `#1a1a1a` | 深色底部区域 |

**页面区块布局（参考 H5UI.png 结构，自上而下）：**

```
┌──────────────────────────────────────┐  ← y=0
│                                      │
│          🎨 Banner 头图区             │  ← 品牌红渐变背景
│     YiwuTrade Logo + 活动名称         │     International Students Recruitment
│     轻粒子/几何动效装饰               │     高度 ~400px
│                                      │
├──────────────────────────────────────┤  ← 浅灰背景 #f0f1f4
│                                      │
│     📋 Personal Information          │  ← 白色卡片，左侧红色 4px 竖条
│     ┌────────────────────────┐       │     圆角 16px，阴影
│     │ Name, Gender, Phone,   │       │     7 个字段
│     │ Email, Nationality,    │       │
│     │ Birthday, Passport No. │       │
│     └────────────────────────┘       │
│                                      │
├──────────────────────────────────────┤  ← 白色背景 #ffffff
│                                      │
│     🌐 Languages                     │  ← 白色卡片
│     ┌────────────────────────┐       │     3 个字段
│     │ Proficient Languages,  │       │
│     │ HSK Level, English     │       │
│     └────────────────────────┘       │
│                                      │
├──────────────────────────────────────┤  ← 浅灰背景 #f0f1f4
│                                      │
│     🎓 Education Background          │  ← 白色卡片
│     ┌────────────────────────┐       │     5 个字段
│     │ University, Major,     │       │
│     │ Degree, Year, Grad Date│       │
│     └────────────────────────┘       │
│                                      │
├──────────────────────────────────────┤  ← 白色背景 #ffffff
│                                      │
│     💼 Career & Background           │  ← 白色卡片
│     ┌────────────────────────┐       │     3 个字段
│     │ Post-grad Plan, City,  │       │     Family Business 用 textarea
│     │ Family Business         │       │
│     └────────────────────────┘       │
│                                      │
├──────────────────────────────────────┤  ← 浅灰背景 #f0f1f4
│                                      │
│     ☑ I agree to the collection     │  ← 隐私同意勾选框
│        and processing of my          │
│        personal data...              │
│                                      │
│     ┌────────────────────────┐       │
│     │     Submit Application  │       │  ← 品牌红全宽按钮
│     └────────────────────────┘       │
│                                      │
├──────────────────────────────────────┤  ← Footer 深色背景 #1a1a1a
│                                      │
│     Privacy Notice / Copyright       │  ← 白色文字，浅灰辅助文字
│     © 2026 YiwuTrade                 │
│                                      │
└──────────────────────────────────────┘
```

**字体层级：**

| 层级 | 字号 | 字重 | 用途 |
|------|------|------|------|
| H1 | 28px | Bold 700 | 页面主标题 |
| H2 | 22px | Semibold 600 | 区块标题 |
| Body | 16px | Regular 400 | 表单标签、正文 |
| Caption | 13px | Regular 400 | 辅助说明、校验提示 |

### 7.2 后台管理端

**视觉风格**：标准企业后台风格，使用 Element Plus 默认主题。信息密度适中，操作路径清晰。

---

## 八、技术方案概要

### 8.1 推荐技术栈

| 层级 | 技术 | 选型理由 |
|------|------|----------|
| H5 前端 | Vue 3 + Vite + Vant UI | 移动端组件库成熟，支持按需引入，体积小 |
| Admin 前端 | Vue 3 + Vite + Element Plus | Vue 生态最成熟的桌面端组件库 |
| 后端框架 | Express.js（推荐）或 NestJS | Express 轻量灵活，适合此规模项目；NestJS 适合后续扩展 |
| 数据库 | PostgreSQL | 成熟的关系型数据库，JSONB 支持语言能力数组，pg_trgm 支持模糊搜索 |
| ORM | Prisma 或 Knex | Prisma 类型安全开发体验好；Knex 灵活度高 |
| 部署 | 开发测试：本地部署（Docker Compose）；生产：阿里云 ECS + RDS PostgreSQL |
| Excel 导出 | exceljs | 纯 JS 实现，支持 .xlsx 格式，无需系统依赖 |

### 8.2 项目结构（建议）

```
InStuRecruitment/
├── packages/
│   ├── h5/                  # 留学生 H5 前端 (Vue 3 + Vant)
│   ├── admin/               # 后台管理前端 (Vue 3 + Element Plus)
│   └── server/              # 后端服务 (Express + Prisma + PostgreSQL)
├── docs/
│   └── prd-v1.0.md          # 本 PRD 文档
├── CLAUDE.md
├── Requirements.md
└── README.md
```

---

## 九、里程碑与交付物

### 9.1 里程碑

| 阶段 | 内容 | 预计产出 |
|------|------|----------|
| M1 — 设计与确认 | UI 设计稿评审、字段最终确认、品牌素材到位 | 设计稿定稿 |
| M2 — 后端开发 | 数据库建表、API 开发、管理员登录 | 可调用的 API |
| M3 — H5 前端开发 | 报名页面、表单校验、动效、提交流程 | H5 可访问 |
| M4 — Admin 前端开发 | 登录页、列表页、筛选、导出 | 后台可访问 |
| M5 — 联调部署 | 前后端联调、部署上线、数据初始化 | 系统上线 |

### 9.2 v1.0 交付物清单

| 交付物 | 说明 |
|--------|------|
| H5 报名页 | 可访问的 URL，留学生可提交报名 |
| 后台管理页 | 管理员可登录、查看、筛选、导出数据 |
| 数据库 | PostgreSQL，含初始管理员账号 |
| 部署 | 生产环境可访问 |

---

## 附录 A：待确认事项

| # | 事项 | 状态 | 负责人 |
|---|------|------|--------|
| 1 | 活动名称与品牌信息 | ✅ 已确认：International Students Recruitment，品牌 YiwuTrade | 项目方 |
| 2 | Banner 主题图片 / 品牌 Logo 图片文件 | ✅ 已提供：`docs/assets/APP logo.jpg`（建议后续更名为 kebab-case 无空格格式） | 设计师 |
| 3 | 品牌主色 | ✅ 已确认：`#d00000`（取自 Logo 主色），配色方案已更新至 7.1 节 | 项目方 |
| 4 | 管理员初始账号密码 | ✅ 已确认：`admin` / `admin123` | 项目方 |
| 5 | 国家列表是否限定范围 | ✅ 已确认：不限范围，用户文本框自由输入 | 项目方 |
| 6 | 护照号加密密钥管理方案 | ✅ 已确认：环境变量方案，密钥存放在服务器 `.env`，应用启动时读取，不提交 Git | 技术负责人 |
| 7 | 部署平台选择 | ✅ 已确认：开发测试阶段本地部署，正式上线阿里云 | 技术负责人 |
| 8 | 枚举选项确认 | ✅ 全部确认：HSK 1-9 / 英语 4 档 / 当前年级保持现有 | 项目方 |
| 9 | 毕业后计划选项确认 | ✅ 已确认：深造/实习兼职/全职/创立公司 4 项 | 项目方 |

---

> **文档版本**：v1.0-draft-2  
> **最后更新**：2026-07-17  
> **变更记录**：
> - v1.0-draft-1（2026-07-17）：初始版本，14 字段表单
> - v1.0-draft-2（2026-07-17）：表单调整为 18 字段，确认品牌名 YiwuTrade / 活动名 International Students Recruitment
> **下一步**：确认附录 A 待办事项后，进入 M1 设计阶段
