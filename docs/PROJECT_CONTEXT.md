# FIRE生活家 - AI 开发上下文文档

> **用途**: 供 AI 助手快速理解项目架构、代码规范和业务逻辑，提高开发效率
> **更新时间**: 2026-05-20
> **适用平台**: Coze / Trae

---

## 一、项目总览

### 1.1 产品定位

**FIRE生活家** 是一款面向追求财务自由的年轻用户（尤其是程序员群体）的智能记账应用。通过极简的记账体验、清晰的资产可视化和数据驱动的FIRE进度追踪，帮助用户养成记账习惯、实现财务目标。

### 1.2 产品 Slogan

```
记账省心、资产有数、FIRE可期
```

### 1.3 产品架构

```
FIRE生活家
├── 记账省心 ────→ 记录每笔收支，关联账户
├── 资产有数 ←─── 记账数据自动更新资产
│   ├── 现金类（余额即价值）
│   ├── 投资类（市值波动）
│   ├── 固定资产（估值+负债）
│   └── 折旧资产（自动折旧+残值）
├── FIRE可期 ←─── 资产+支出数据驱动
│   ├── 目标设定（4%法则）
│   ├── 进度追踪（净资产/目标比）
│   └── 储蓄率&报告
└── 系统配置
    ├── 登录注册
    ├── 设置
    └── 数据同步
```

### 1.4 仓库列表

| 仓库 | 地址 | 分支 | 说明 |
|------|------|------|------|
| **firelifes_front** | https://github.com/firelifes/firelifes_front.git | main | 前端 UniApp 项目 |
| **firelifes_back** | https://github.com/firelifes/firelifes_back.git | main | 后端 Midway.js 项目 |
| **firelifes.github.io** | https://github.com/firelifes/firelifes.github.io.git | main | 博客网站（Jekyll + GitHub Pages） |

---

## 二、技术栈

### 2.1 前端技术栈

```
框架:     Vue 3 + TypeScript
UI组件:   Wot Design Uni
构建:     UniApp (支持微信小程序/H5)
样式:     SCSS
状态管理: Pinia
路由:     pages.json 配置
```

### 2.2 后端技术栈

```
框架:     Midway.js v4 (基于 Koa)
ORM:      TypeORM v0.3.28
数据库:   PostgreSQL
认证:     JWT + bcrypt
验证:     Joi
配置管理: dotenv (支持多环境)
```

### 2.3 部署目标

- 微信小程序
- H5 移动端网页

---

## 三、前端项目结构 (firelifes_front)

### 3.1 目录结构

```
firelifes_front/
├── src/
│   ├── api/                    # API 接口层
│   │   ├── budget.ts           # 预算相关接口
│   │   ├── record.ts           # 记账相关接口
│   │   └── ...
│   ├── components/             # 公共组件
│   │   ├── BudgetBar.vue       # 预算进度条
│   │   └── ...
│   ├── pages/                  # 页面目录
│   │   ├── detail/             # 明细页
│   │   │   ├── budget/         # 预算模块
│   │   │   │   ├── index.vue           # 预算总览
│   │   │   │   ├── budget-setting.vue  # 预算设置
│   │   │   │   └── components/         # 预算子组件
│   │   │   ├── bill.vue        # 账单明细
│   │   │   ├── fire-progress.vue  # FIRE进度
│   │   │   ├── function-list.vue  # 功能列表
│   │   │   └── index.vue       # 明细首页
│   │   ├── record/             # 记账页面
│   │   │   ├── edit-record.vue # 编辑/新建记录
│   │   │   └── components/     # 记账组件
│   │   └── my/                 # 我的页面
│   ├── stores/                 # Pinia 状态管理
│   │   └── functionItems.ts    # 功能项状态
│   └── pages.json              # 路由配置
├── docs/
│   ├── ARCHITECTURE.md         # 产品架构文档
│   ├── DEVELOPMENT.md          # 开发规范
│   └── requirements/           # 需求文档（按模块分类）
└── .trae/                      # Trae 任务规范
```

### 3.2 核心 API 接口文件

**src/api/budget.ts** - 预算相关接口

```typescript
// 主要接口
GET /api/budget/detail          # 获取预算详情
POST /api/budget/save           # 保存预算（支持批量）
POST /api/budget/copy-last-month  # 复制上月预算
DELETE /api/budget/:id          # 删除预算
```

### 3.3 页面路由说明

| 路径 | 说明 |
|------|------|
| `pages/detail/index` | 明细首页（预算进度总览） |
| `pages/detail/budget/index` | 预算列表页 |
| `pages/detail/budget/budget-setting` | 预算设置页 |
| `pages/detail/bill` | 账单明细页 |
| `pages/detail/fire-progress` | FIRE进度页 |
| `pages/record/edit-record` | 记账编辑页 |
| `pages/my/index` | 我的页面 |

---

## 四、后端项目结构 (firelifes_back)

### 4.1 分层架构

```
┌─────────────────────────────────┐
│     Controller (控制器层)        │  ← 处理 HTTP 请求
├─────────────────────────────────┤
│      Service (业务逻辑层)       │  ← 核心业务逻辑
├─────────────────────────────────┤
│    Entity / Repository (数据层) │  ← 数据库操作
└─────────────────────────────────┘
```

### 4.2 目录结构

```
firelifes_back/
├── src/
│   ├── config/                 # 多环境配置
│   │   ├── config.default.ts   # 默认配置
│   │   ├── config.local.ts     # 本地开发
│   │   ├── config.sit.ts       # SIT 测试
│   │   └── config.prod.ts      # 生产环境
│   ├── controller/             # 控制器层
│   │   ├── budget.controller.ts   # 预算控制器
│   │   ├── record.controller.ts   # 记账控制器
│   │   ├── auth.controller.ts     # 认证控制器
│   │   ├── category.controller.ts # 分类控制器
│   │   └── user.controller.ts     # 用户控制器
│   ├── service/                # 业务逻辑层
│   │   ├── budget.service.ts   # 预算业务
│   │   ├── record.service.ts   # 记账业务
│   │   ├── auth.service.ts     # 认证业务
│   │   └── ...
│   ├── entity/                 # 数据实体层
│   │   ├── budget.entity.ts    # 预算实体
│   │   ├── record.entity.ts    # 记账记录实体
│   │   ├── category.entity.ts  # 分类实体
│   │   └── ...
│   ├── middleware/             # 中间件
│   │   ├── jwt.middleware.ts   # JWT 认证中间件
│   │   └── report.middleware.ts # 请求日志中间件
│   └── filter/                 # 异常过滤器
│       ├── default.filter.ts   # 全局异常处理
│       └── notfound.filter.ts  # 404 处理
├── API.md                      # API 文档
├── ARCHITECTURE.md             # 架构文档
└── bootstrap.js                # 启动入口
```

### 4.3 核心实体说明

#### 预算实体 (Budget)

```typescript
表名: budgets

字段说明:
- id: number              # 预算ID，主键自增
- userId: number          # 用户ID，关联users表
- budgetType: 'normal' | 'reserve'  # 预算类型
- name: string            # 预算名称
- typeId: number          # 分类ID（空表示总预算）
- categoryGroupId: number # 分类组ID
- periodType: 'monthly' | 'quarterly' | 'yearly'  # 周期类型
- year: number            # 年份
- month: number           # 月份
- amount: number          # 预算金额
- spent: number           # 已用金额
- alertThreshold: number  # 预警阈值百分比（默认80）
- alertEnabled: boolean   # 是否启用预警
- isActive: boolean       # 是否生效
```

#### 记账记录实体 (Record)

```typescript
表名: record

核心字段:
- id: number              # 记录ID
- userId: number          # 用户ID
- type: 'expense' | 'income' | 'transfer'  # 记录类型
- amount: number          # 金额
- categoryId: string      # 分类ID
- categoryGroupId: number # 分类组ID
- transactionDate: Date   # 交易日期
- remark: string          # 备注
- isFromReserve: boolean  # 是否从准备金支出
```

### 4.4 数据库关系图

```
User (用户表)
  ├─ 1:N → Record (记账记录)
  ├─ 1:N → Budget (预算)
  ├─ 1:N → UserCategoryCustomization (用户自定义分类)
  ├─ 1:N → UserCategoryGroup (用户分类分组)
  └─ 1:N → UserIcon (用户图标)

Category (分类表)
  ├─ N:1 → CategoryGroup (分类分组)
  ├─ N:1 → Icon (图标)
  └─ 1:N → Record (记账记录)

Budget (预算表)
  └─ 与分类/分类组关联，支持预算消费扣减
```

### 4.5 API 响应格式

所有接口统一返回格式：

```json
{
  "success": boolean,    // 请求是否成功
  "message": string,     // 提示信息
  "data": any            // 返回数据（可选）
}
```

**认证方式**: 需要登录的接口在请求头中携带 `Authorization: Bearer <token>`

**HTTP 状态码规范**:
- `200` - 成功
- `400` - 客户端错误
- `401` - 未授权
- `403` - 禁止访问
- `404` - 资源不存在
- `500` - 服务器错误

---

## 五、预算功能设计

### 5.1 双预算体系

预算功能采用 **双预算体系** 设计：

#### A. 常规月度预算 (normal)
- 日常消费类支出，每月相对固定
- 支持总预算和分类预算
- 可从年度预算自动拆解为月度预算
- 支持手动调整单月预算

#### B. 专项准备金 (reserve)
- 年度大额周期性支出（学费、保险、旅游等）
- 按月平滑计提，解决"某月份预算崩溃"问题
- 实际支出时从准备金扣除
- 支持关联分类，记账时自动匹配

### 5.2 预警机制

三级预警体系：

| 级别 | 阈值 | 说明 |
|------|------|------|
| 🟡 接近 | 80% | 预算使用已达80%，提醒注意 |
| 🟠 即将超支 | 95% | 预算即将用尽，需控制 |
| 🔴 已超支 | 100%+ | 实际支出已超过预算 |

### 5.3 预算消费扣减流程

```
用户记账（支出）
    ↓
检查是否选择"从准备金支出"
    ↓
是 → 从对应准备金扣除
    ↓
否 → 匹配分类预算扣除
    ↓
分类预算扣完 → 从总预算扣除
    ↓
更新预算 spent 字段
    ↓
检查是否触发预警阈值
    ↓
触发预警 → 记录预警日志
```

### 5.4 核心业务逻辑 (BudgetService)

主要方法：

| 方法 | 说明 |
|------|------|
| `getBudgetDetail(userId, year, month)` | 获取指定月份预算详情（含已消费金额） |
| `saveBudget(userId, budgetData)` | 保存单条预算 |
| `saveBatch(userId, budgetList)` | 批量保存预算 |
| `copyLastMonthBudget(userId, year, month)` | 复制上月预算到当前月 |
| `deleteBudget(userId, budgetId)` | 删除预算 |
| `recalculateSpent(userId, year, month)` | 重新计算预算消费金额（数据修复） |
| `consumeBudget(userId, record)` | 记账时扣减预算 |

---

## 六、开发规范

### 6.1 命名规范

#### 前端

| 类型 | 规范 | 示例 |
|------|------|------|
| 组件文件 | PascalCase + .vue | `BudgetProgress.vue` |
| 页面文件 | kebab-case | `budget-setting.vue` |
| 组件名 | PascalCase | `BudgetProgress` |
| TypeScript 类型 | PascalCase | `BudgetItem` |
| 变量/方法 | camelCase | `getBudgetDetail` |
| 常量 | UPPER_SNAKE_CASE | `ALERT_THRESHOLD` |

#### 后端

| 类型 | 规范 | 示例 |
|------|------|------|
| 控制器 | PascalCase + Controller | `BudgetController` |
| 服务 | PascalCase + Service | `BudgetService` |
| 实体 | PascalCase | `Budget` |
| 中间件 | PascalCase + Middleware | `JwtMiddleware` |
| 过滤器 | PascalCase + Filter | `DefaultFilter` |
| 路由 | kebab-case (RESTful) | `/api/budget/detail` |

### 6.2 Git 规范

- 分支：`main` (主分支), `coze_dev` (AI开发分支，已废弃，直接在main开发)
- 提交信息：使用语义化提交
  - `feat:` 新功能
  - `fix:` 修复bug
  - `docs:` 文档更新
  - `style:` 代码格式
  - `refactor:` 重构
  - `test:` 测试
  - `chore:` 构建/工具

### 6.3 代码风格

- TypeScript 严格模式
- 接口返回类型明确定义
- 组件职责单一，避免过大
- 复用公共组件和工具函数

---

## 七、常用开发路径速查

### 7.1 前端路径

```
# 预算相关
前端页面:   src/pages/detail/budget/
预算组件:   src/components/BudgetBar.vue
预算API:    src/api/budget.ts
需求文档:   docs/requirements/01-记账省心/budget/

# 记账相关
记账页面:   src/pages/record/edit-record.vue
记账API:    src/api/record.ts

# 我的页面
我的页面:   src/pages/my/index.vue
```

### 7.2 后端路径

```
# 预算相关
控制器:     src/controller/budget.controller.ts
服务:       src/service/budget.service.ts
实体:       src/entity/budget.entity.ts

# 记账相关
控制器:     src/controller/record.controller.ts
服务:       src/service/record.service.ts
实体:       src/entity/record.entity.ts

# 配置
配置文件:   src/config/config.*.ts
API文档:    API.md
架构文档:   ARCHITECTURE.md
```

### 7.3 博客路径 (firelifes.github.io)

```
Jekyll 博客结构:
- _posts/       # 文章目录
- _layouts/     # 布局模板
- _includes/    # 组件包含
- assets/       # 静态资源（CSS/JS/图片）
```

---

## 八、关键业务流程

### 8.1 记账流程

```
1. 用户进入记账页面
2. 选择类型（支出/收入/转账）
3. 输入金额（支持快捷金额）
4. 选择分类（支持分类分组）
5. 选择账户
6. 选择日期（默认今天）
7. 输入备注（支持智能备注）
8. 可选：勾选"从准备金支出"
9. 提交保存
10. 自动扣减对应预算/准备金
11. 返回结果，支持"继续记下一笔"
```

### 8.2 预算设置流程

```
1. 进入预算设置页面
2. 选择年份和月份
3. 设置总预算金额
4. 设置各分类预算金额（可选）
5. 管理准备金项目（新增/编辑/删除）
6. 设置预警阈值（可选）
7. 保存预算
8. 支持"复制上月预算"快捷操作
```

### 8.3 认证流程

```
用户登录
    ↓
验证用户名密码
    ↓
生成 JWT Token
    ↓
返回 Token 给前端
    ↓
后续请求带上 Authorization: Bearer <token>
    ↓
JWT 中间件验证 Token
    ↓
通过 → 继续请求
失败 → 返回 401 Unauthorized
```

---

## 九、环境变量说明

### 后端环境配置

```
# 数据库配置
DATABASE_URL=postgres://user:pass@host:port/dbname

# JWT 配置
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=7d

# 短信配置（可选）
SMS_PROVIDER=aliyun
SMS_ACCESS_KEY=xxx
SMS_SECRET_KEY=xxx

# 环境
NODE_ENV=local|sit|prod
```

---

## 十、AI 开发指引

### 10.1 开发前必读

1. **先看文档**：开发功能前先阅读 `docs/requirements/` 下对应的需求文档
2. **参考现有代码**：类似功能参考已有实现（如预算参考记账）
3. **保持代码风格一致**：遵循项目现有代码风格和命名规范
4. **小步提交**：功能拆分，避免一次提交过多代码

### 10.2 新增功能步骤

```
1. 阅读/编写需求文档 (docs/requirements/)
2. 后端实现:
   - Entity 数据实体 (src/entity/)
   - Service 业务逻辑 (src/service/)
   - Controller 控制器 (src/controller/)
3. 前端实现:
   - API 接口封装 (src/api/)
   - 组件开发 (src/components/)
   - 页面开发 (src/pages/)
   - 路由配置 (pages.json)
4. 前后端联调测试
5. 更新本文档（如有架构变更）
```

### 10.3 问题排查

- **后端报错**: 检查终端日志，查看 Controller/Service 代码
- **前端报错**: 检查浏览器控制台，查看 API 请求和响应
- **数据库问题**: 检查 Entity 定义，确认数据库表结构
- **认证问题**: 检查 JWT Token 是否正确携带，Token 是否过期

---

**文档版本**: v1.0
**最后更新**: 2026-05-20
**维护者**: AI 开发助手
