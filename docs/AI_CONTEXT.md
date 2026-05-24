# FIRE生活家 - 项目上下文 (AI Rules)

> **自动加载**: Trae 每次对话开始时自动读取本文件。
> **跨工具通用**: Coze / Claude / GPT 等工具请引用 `firelifes_front/docs/AI_CONTEXT.md`（与本文件内容完全一致）。
>
> **⚠️ 强制自动更新**: 本文件必须反映项目最新状态。当发生以下变更时，AI 必须自动更新本文件并同步到 `.trae/rules/project_rules.md`：
> - 新增/删除/重命名页面或组件
> - 新增/删除 API 文件或接口
> - 新增/删除数据库实体
> - 新增/删除 Pinia Store
> - 技术栈或核心依赖变更
> - 核心业务逻辑变更
> - 代码规范变更
> - 路由 (pages.json) 变更
>
> **更新后必须运行**: 校验两个文件内容完全一致。

---

## 1. 项目身份

| 项 | 值 |
|---|---|
| 项目名 | FIRE生活家 (firelifes) |
| Slogan | 记账省心、资产有数、FIRE可期 |
| 类型 | 智能记账应用 (UniApp H5 + 微信小程序) |
| 目标用户 | 追求财务自由的年轻用户，尤其是程序员群体 |

### 仓库

| 仓库 | 相对路径 | 说明 |
|------|---------|------|
| firelifes_front | `firelifes_front/` | 前端 UniApp (Vue3 + TypeScript) |
| firelifes_back | `firelifes_back/` | 后端 Midway.js v4 (Koa + TypeORM + PostgreSQL) |

---

## 2. 技术栈

### 前端 (firelifes_front)

```
框架:     Vue 3 + TypeScript (Composition API)
构建:     UniApp (支持 H5 + 微信小程序)
UI 组件:  Wot Design Uni (wd-* 前缀)
状态管理: Pinia (stores/)
路由:     pages.json 配置式路由
样式:     SCSS + CSS Variables (主题系统) + iconfont 字体图标
HTTP:     src/api/request.ts (统一拦截器, 默认 needAuth: true)
```

### 后端 (firelifes_back)

```
框架:     Midway.js v4 (基于 Koa)
ORM:      TypeORM v0.3 (synchronize: true 自动建表)
数据库:   PostgreSQL
认证:     JWT (7天有效期) + bcrypt (10轮加密)
配置:     dotenv + 多环境配置 (local/sit/prod)
中间件链: CorsMiddleware → ReportMiddleware → JwtMiddleware → 路由
```

---

## 3. 目录结构 (严格遵循)

### 前端核心路径

```
firelifes_front/
├── src/
│   ├── api/                    # API 层 (每个文件对应一组接口)
│   │   ├── request.ts          #   统一请求 (Token注入, 401拦截)
│   │   ├── auth.ts             #   认证 (登录/注册/短信)
│   │   ├── record.ts           #   记账记录
│   │   ├── account.ts          #   账户管理
│   │   ├── category.ts         #   分类管理
│   │   ├── budget.ts           #   预算管理
│   │   ├── user-config.ts      #   用户配置 (主题等偏好)
│   │   └── ads.ts              #   广告 (开屏)
│   ├── components/             # 全局公共组件
│   │   ├── BudgetBar.vue       #   预算进度条
│   │   ├── CustomTabbar.vue    #   底部导航 (明细/统计/记账/分析/我的)
│   │   └── YearMonthPicker.vue #   年月选择器
│   ├── config/
│   │   └── index.ts            #   应用配置 (apiBaseUrl, tokenKey, userKey)
│   ├── pages/                  # 页面 (每个子目录一个功能模块)
│   │   ├── splash/index.vue    #   开屏广告页
│   │   ├── login/              #   登录注册
│   │   │   ├── login.vue
│   │   │   ├── register.vue
│   │   │   └── forgot-password.vue
│   │   ├── detail/             #   明细首页 (核心)
│   │   │   ├── index.vue       #     月度账单首页 + 功能入口
│   │   │   ├── bill.vue        #     账单汇总
│   │   │   ├── fire-progress.vue  #   FIRE进度
│   │   │   ├── function-list.vue  #   功能列表(可拖拽排序)
│   │   │   ├── components/     #     明细页子组件
│   │   │   │   ├── BillCard.vue
│   │   │   │   ├── DetailHeader.vue
│   │   │   │   ├── FunctionBar.vue
│   │   │   │   └── SavingsRateCard.vue
│   │   │   └── budget/         #     预算模块
│   │   │       ├── index.vue
│   │   │       ├── budget-setting.vue
│   │   │       └── components/BudgetProgress.vue
│   │   ├── record/             #   记账页面
│   │   │   ├── index.vue       #     记账主入口
│   │   │   ├── edit-record.vue #     编辑/新建记录
│   │   │   └── components/
│   │   │       ├── CategorySelector.vue
│   │   │       ├── AccountSelector.vue
│   │   │       ├── AccountSelectorPopup.vue
│   │   │       ├── AssetFields.vue
│   │   │       ├── DatePicker.vue
│   │   │       ├── RecordConfirmCard.vue
│   │   │       └── TransactionForm.vue
│   │   ├── my/                 #   我的页面
│   │   │   ├── index.vue       #     个人中心
│   │   │   ├── account-setting/
│   │   │   │   ├── account-list.vue
│   │   │   │   └── account-edit.vue
│   │   │   ├── category-setting/
│   │   │   │   ├── category-group-list.vue
│   │   │   │   ├── category-group-edit.vue
│   │   │   │   ├── category-list.vue
│   │   │   │   └── category-edit.vue
│   │   │   └── theme-setting/
│   │   │       └── theme.vue
│   │   ├── analysis/index.vue  #   分析页
│   │   └── statistics/index.vue #  统计页
│   ├── stores/                 # Pinia 状态
│   │   ├── user.ts             #   用户认证 + 用户配置
│   │   └── functionItems.ts    #   功能入口排序
│   ├── theme/                  # 主题系统 (CSS Variables)
│   │   ├── index.ts            #   主题初始化/应用/同步 (含服务端同步)
│   │   ├── presets.ts          #   3套预设主题 (teal/blue/amber)
│   │   └── variables.css       #   CSS 变量定义
│   ├── types/                  # TypeScript 类型
│   │   ├── account.ts          #   账户类型 (5种)
│   │   └── asset.ts            #   资产类型
│   ├── utils/                  # 工具函数
│   │   ├── storage.ts          #   localStorage 封装
│   │   ├── validate.ts         #   表单验证
│   │   ├── navigate.ts         #   导航
│   │   └── countdown.ts        #   倒计时
│   ├── static/iconfont/        # 56个分类图标字体
│   ├── locale/                 # 国际化 (zh/en)
│   ├── App.vue
│   ├── main.ts
│   ├── pages.json              # 路由配置 (所有页面声明)
│   └── uni.scss
├── docs/
│   ├── AI_CONTEXT.md           #   跨工具项目上下文 (本文件)
│   ├── requirements/           # 需求文档 (按模块-子模块组织)
│   │   ├── 01-记账省心/
│   │   ├── 02-资产有数/
│   │   ├── 03-FIRE可期/
│   │   └── 04-系统配置/
│   └── 流程图/                 # ASCII + ASKII 格式流程图 (5个)
├── designs/                    # UI 设计稿 (.pen 文件)
├── .env.development            # 开发环境变量
├── .env.sit                    # SIT 环境变量
├── .env.production             # 生产环境变量
└── .trae/
    ├── rules/
    │   └── project_rules.md    #   Trae 自动加载的项目规则
    └── specs/                  # Trae 任务规范快照
```

### 后端核心路径

```
firelifes_back/
├── src/
│   ├── config/                 # 多环境配置
│   ├── controller/             # 控制器层 (HTTP 路由)
│   │   ├── auth/auth.controller.ts
│   │   ├── user/user.controller.ts     # 含 /user/config 接口
│   │   ├── account/account.controller.ts
│   │   ├── category/category.controller.ts
│   │   ├── record/record.controller.ts
│   │   ├── budget.controller.ts
│   │   └── ad.controller.ts
│   ├── service/                # 业务逻辑层
│   │   ├── auth.service.ts     #   注册/登录/微信登录 (含新用户初始化调用)
│   │   ├── user.service.ts     #   用户信息 + 用户配置CRUD + initUserConfig
│   │   ├── account.service.ts  #   账户CRUD + 3个默认账户创建
│   │   ├── category.service.ts #   分类CRUD + 新用户105条数据初始化
│   │   ├── record.service.ts   #   记账记录CRUD
│   │   ├── budget.service.ts   #   预算双体系
│   │   ├── net-worth.service.ts #  净资产计算引擎
│   │   ├── sms.service.ts      #   短信验证码
│   │   └── ad.service.ts
│   ├── entity/                 # 数据实体 (14个)
│   │   ├── user.entity.ts
│   │   ├── user_config.entity.ts          # 用户配置表 (key-value)
│   │   ├── user_category_customization.entity.ts
│   │   ├── user_category_group.entity.ts
│   │   ├── user_icon.entity.ts
│   │   ├── account.entity.ts
│   │   ├── record.entity.ts
│   │   ├── category.entity.ts
│   │   ├── category_group.entity.ts
│   │   ├── icon.entity.ts
│   │   ├── budget.entity.ts
│   │   ├── depreciating_asset.entity.ts
│   │   ├── sms_code.entity.ts
│   │   └── ad.entity.ts
│   ├── middleware/             # 中间件
│   │   ├── cors.middleware.ts  #   最先执行
│   │   ├── report.middleware.ts #  请求日志
│   │   └── jwt.middleware.ts   #   JWT 认证 (忽略 /auth/*)
│   ├── filter/                 # 异常过滤器
│   ├── configuration.ts        # 主配置 (中间件链注册)
│   └── interface.ts
├── init-db.ts                  # 数据库初始化脚本
└── package.json
```

---

## 4. 页面路由速查 (pages.json)

| 路由路径 | 页面 | 说明 |
|---------|------|------|
| `pages/splash/index` | 开屏 | 广告开屏 |
| `pages/login/login` | 登录 | 手机号+密码/验证码登录 |
| `pages/login/register` | 注册 | 手机号+验证码注册 |
| `pages/login/forgot-password` | 忘记密码 | |
| `pages/detail/index` | 明细首页 | 核心页面，月份切换+流水列表 |
| `pages/detail/bill` | 账单汇总 | |
| `pages/detail/function-list` | 全部功能 | 功能入口列表(可拖拽) |
| `pages/detail/fire-progress` | FIRE进度 | |
| `pages/detail/budget/index` | 预算总览 | |
| `pages/detail/budget/budget-setting` | 预算设置 | |
| `pages/statistics/index` | 统计页 | |
| `pages/record/index` | 记账入口 | 支出/收入/转账/还债 |
| `pages/record/edit-record` | 编辑记录 | |
| `pages/analysis/index` | 分析页 | |
| `pages/my/index` | 我的 | 个人中心 |
| `pages/my/category-setting/category-group-list` | 大类管理 | 分类大类列表 |
| `pages/my/category-setting/category-list` | 子分类管理 | |
| `pages/my/account-setting/account-list` | 账户列表 | |
| `pages/my/account-setting/account-edit` | 账户编辑 | |
| `pages/my/theme-setting/theme` | 主题设置 | 预设+自定义颜色 |

---

## 5. 代码规范 (严格遵循)

### 5.1 文件命名

| 类型 | 规范 | 示例 |
|------|------|------|
| Vue 页面 | kebab-case.vue | `fire-progress.vue` |
| Vue 组件 | PascalCase.vue | `BillCard.vue` |
| TS 模块 | kebab-case.ts | `user-config.ts` |
| API 文件 | kebab-case.ts, 与后端控制器对应 | `account.ts` |
| 需求文档 | kebab-case.md, 置于 `docs/requirements/{模块}/{子模块}/` | |
| 流程图 MD | 中文名 + 描述, 置于 `docs/流程图/` | `记账流程_流程图.md` |

### 5.2 代码风格

- **不要添加注释**，除非用户明确要求
- 使用 `const` / `let`，禁止 `var`
- 函数优先使用 `async/await`
- Vue 组件使用 `<script setup lang="ts">` + Composition API
- API 请求统一通过 `src/api/request.ts` 的 `request()` 函数，默认 `needAuth: true`
- API 响应格式统一: `{ success: boolean, data?: any, message?: string }`

### 5.3 路径引用

- 组件内引用使用相对路径: `../../../stores/user`
- API 文件引用: `import request from './request'`

### 5.4 样式规范

- 全部使用 CSS Variables (`var(--color-primary)`) 而非硬编码色值
- 主题变量定义在 `src/theme/variables.css` 和 `src/theme/presets.ts`
- 不要新增 `#xxxxxx` 硬编码颜色
- 不要在 `.vue` 文件中定义 `<style>` 之外的全局样式

---

## 6. 核心业务逻辑

### 6.1 新用户注册初始化链路 (105 条数据自动创建)

```
注册 → auth.service.ts
  ├── users 表                      1条
  ├── categoryService.initUserCategories()
  │   ├── user_category_groups      10条 (10个大类)
  │   ├── user_icons                45条 (45个emoji图标)
  │   └── user_category_customizations 45条 (37支出+8收入分类)
  ├── accountService.createDefaultAccounts()
  │   └── accounts                  3条 (现金💵/折旧资产📱/固定资产🏠)
  └── userService.initUserConfig()
      └── user_configs              1条 (theme: teal预设)
```

### 6.2 账户体系 (5 种类型)

| 类型 | type 标识 | 颜色 | 说明 |
|------|----------|------|------|
| 现金类 | `cash` | 🟢 | 现金、银行卡、支付宝、微信 |
| 投资类 | `investment` | 🟠 | 股票、基金、债券 |
| 固定资产 | `fixed_asset` | 🟣 | 房产、车位 |
| 折旧资产 | `depreciable_asset` | 🔵 | 手机、电脑、家电 |
| 负债类 | `liability` | 🔴 | 信用卡、贷款 |

### 6.3 用户配置系统 (user_configs 表)

- 表结构: key-value 行 (`config_key` + `config_value` JSON)，唯一索引 `(user_id, config_key)`
- 首期配置项: `theme` = `{ mode, presetName, customColors }`
- 读写策略: 前端先写 localStorage（即时生效），异步写服务端；登录时从服务端拉取覆盖本地
- API: `GET /user/config` + `PUT /user/config`

### 6.4 主题系统

- 3 套预设: `teal`(稳重蓝绿/默认) / `blue`(深邃蓝) / `amber`(暖琥珀)
- 18 个 CSS Token，所有页面通过 `var(--color-xxx)` 引用
- 主题切换即时生效 (localStorage) + 异步同步服务端

### 6.5 预算体系 (双体系)

- **常规月度预算** (normal): 日常消费类，支持总预算+分类预算
- **专项准备金** (reserve): 年度大额支出，按月平滑计提
- 三级预警: 80%🟡接近 / 95%🟠即将超支 / 100%+🔴已超支

---

## 7. API 约定

### 请求封装 (src/api/request.ts)

- 默认 `needAuth: true`，自动在请求头注入 `Authorization: Bearer <token>`
- 401 自动清除登录态
- 仅公开接口 (登录/注册/发送短信) 使用 `needAuth: false`

### 后端响应格式

```typescript
interface IApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
}
```

### JWT 鉴权

- `JwtMiddleware` 忽略 `/auth/*` 路径
- `ctx.state.user = { userId, username }` 在中间件中注入
- Token 有效期 7 天

---

## 8. 关键 Store (Pinia)

### userStore (stores/user.ts)
```typescript
// State
token: string | null
user: User | null
userConfig: Record<string, any> | null   // 用户配置(主题等)

// Key Actions
setAuth(token, user)      // 登录时调用，自动触发 fetchUserConfig()
clearAuth()               // 退出登录
fetchUserConfig()         // 从服务端拉取配置 + 老用户迁移
syncThemeToServer()       // 主题变更时同步到服务端
```

### functionItemsStore (stores/functionItems.ts)
- 功能入口排序 (bill/asset/fire/cashback)
- localStorage 持久化

---

## 9. 需求文档索引

| 模块 | 路径 | 功能数 |
|------|------|--------|
| 01-记账省心 | `docs/requirements/01-记账省心/` | 19 |
| 02-资产有数 | `docs/requirements/02-资产有数/` | 7 |
| 03-FIRE可期 | `docs/requirements/03-FIRE可期/` | 4 |
| 04-系统配置 | `docs/requirements/04-系统配置/` | 20 |

关键需求文档快速定位:
- 用户认证: `04-系统配置/login/`
- 用户配置表: `04-系统配置/user-config.md`
- 新用户默认配置: `04-系统配置/new-user-default-config.md`
- 主题设置: `04-系统配置/theme-settings/theme.md`

---

## 10. 禁止事项

1. ❌ 不要在 Vue 文件中硬编码颜色值 (`#xxxxxx`)，必须使用 `var(--color-xxx)`
2. ❌ 不要删除或修改 `pages.json` 中的路由声明
3. ❌ 不要修改 `src/api/request.ts` 的拦截逻辑
4. ❌ 不要在 `.vue` 文件外定义全局样式
5. ❌ 不要引入项目未使用的新依赖（先检查 package.json）
6. ❌ 不要修改其他智能体负责的功能模块
7. ❌ 不要创建根目录下的非必要文件（除非明确要求）
8. ❌ API 接口不要改动已有字段的类型和名称
