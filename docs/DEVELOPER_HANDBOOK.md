# FIRE生活家 - 开发者手册

> **版本**: v2.0 | **最后更新**: 2026-05-21
> **适用人群**: 开发人员 + AI 开发助手
> **适用平台**: Coze / Trae / 本地开发

---

## 📖 如何使用本文档

- **开发人员**: 按章节查阅，从「产品架构」→「技术栈」→「开发规范」→「设计规范」依次阅读
- **AI 助手**: 完整引用本文档作为上下文，包含所有业务逻辑、代码规范和路径速查
- **代码审查**: 参考第 7 章「代码审查清单」进行自查

---

## 第一部分：产品架构与业务逻辑

### 1.1 产品定位

**FIRE生活家** 是一款面向追求财务自由的年轻用户（尤其是程序员群体）的智能记账应用。通过极简的记账体验、清晰的资产可视化和数据驱动的FIRE进度追踪，帮助用户养成记账习惯、实现财务目标。

### 1.2 产品 Slogan

```
记账省心、资产有数、FIRE可期
```

### 1.3 四大核心模块

```
FIRE生活家
├── 记账省心 ────→ 记录每笔收支，关联账户
│   ├── 明细页（月度账单首页 + 功能入口 + 月份切换）
│   ├── 记账页（支出/收入/转账/还债 + 分类选择 + 账户选择）
│   └── 统计页（月度收支统计）
├── 资产有数 ←─── 记账数据自动更新资产
│   ├── 现金类（余额即价值）
│   ├── 投资类（市值波动）
│   ├── 固定资产（估值+负债）
│   └── 折旧资产（自动折旧+残值）
├── FIRE可期 ←─── 资产+支出数据驱动
│   ├── FIRE进度（明细页进度条 + 独立进度页）
│   ├── 储蓄率卡片（嵌入明细页）
│   ├── 目标设定（4%法则）
│   └── 月度FIRE报告
└── 系统配置
    ├── 登录注册（手机验证码）
    ├── 账户设置（列表 + 编辑 + 5种账户类型）
    ├── 分类设置（大类 + 子分类管理）
    └── 预算设置（双预算体系）
```

### 1.4 数据流（核心飞轮）

```
记账省心 ──(支出/收入数据)──→ 资产有数 ──(净资产/储蓄率)──→ FIRE可期
    ↑                              |                            |
    └────────(FIRE目标反馈消费决策)←─┘                            |
    └──────────────(月度报告推送)←────────────────────────────────┘
```

### 1.5 仓库列表

| 仓库 | 地址 | 分支 | 说明 |
|------|------|------|------|
| **firelifes_front** | https://github.com/firelifes/firelifes_front.git | main | 前端 UniApp 项目 |
| **firelifes_back** | https://github.com/firelifes/firelifes_back.git | main | 后端 Midway.js 项目 |
| **firelifes.github.io** | https://github.com/firelifes/firelifes.github.io.git | main | 博客网站（Jekyll + GitHub Pages） |

### 1.6 账户体系 (5 种账户类型)

| 类型 | 类型标识 | 余额颜色 | 色条颜色 | emoji | 说明 |
|------|---------|---------|---------|-------|------|
| 现金类 | `cash` | `#19BE6B` | `#00BFFF` | 💰 | 现金、银行卡、支付宝、微信等 |
| 投资类 | `investment` | `#19BE6B` | `#FF9800` | 📈 | 股票、基金、债券等 |
| 固定资产类 | `fixed_asset` | `#19BE6B` | `#9C27B0` | 🏠 | 房产、车位、商铺等 |
| 折旧资产类 | `depreciable_asset` | `#19BE6B` | `#00BCD4` | 📱 | 手机、电脑、家电等 |
| 负债类 | `liability` | `#FA3534` | `#FA3534` | 💳 | 信用卡、贷款、花呗等 |

**默认账户**（用户注册后自动创建）：
| 账户名称 | 图标 | 类型 | 默认支出 | 默认收入 |
|---------|------|------|---------|---------|
| 现金 | 💵 | cash | ✅ | ✅ |
| 折旧资产 | 📱 | depreciable_asset | ❌ | ❌ |
| 固定资产 | 🏠 | fixed_asset | ❌ | ❌ |

### 1.7 预算功能 - 双预算体系

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

#### 三级预警机制

| 级别 | 阈值 | 说明 |
|------|------|------|
| 🟡 接近 | 80% | 预算使用已达80%，提醒注意 |
| 🟠 即将超支 | 95% | 预算即将用尽，需控制 |
| 🔴 已超支 | 100%+ | 实际支出已超过预算 |

---

## 第二部分：技术栈与项目结构

### 2.1 技术栈总览

#### 前端技术栈

```
框架:     Vue 3 + TypeScript
UI组件:   Wot Design Uni (wd-*)
构建:     UniApp (支持微信小程序/H5)
样式:     SCSS + iconfont 字体图标
状态管理: Pinia
路由:     pages.json 配置
图标:     iconfont (src/static/iconfont/) — 56 个字形
```

#### 后端技术栈

```
框架:     Midway.js v4 (基于 Koa)
ORM:      TypeORM v0.3.28
数据库:   PostgreSQL
认证:     JWT + bcrypt
验证:     Joi
配置管理: dotenv (支持多环境: local/sit/prod)
CORS:     自定义 CorsMiddleware (最先执行)
```

#### 部署目标
- H5 移动端网页
- 微信小程序

### 2.2 前端项目结构 (firelifes_front)

```
firelifes_front/
├── src/
│   ├── api/                    # API 接口层
│   │   ├── account.ts          # 账户相关接口
│   │   ├── ads.ts              # 广告接口（开屏）
│   │   ├── auth.ts             # 认证接口
│   │   ├── budget.ts           # 预算相关接口
│   │   ├── category.ts         # 分类管理接口
│   │   ├── record.ts           # 记账相关接口
│   │   └── request.ts          # 统一请求封装（Token/401拦截）
│   ├── components/             # 公共组件
│   │   ├── BudgetBar.vue       # 预算进度条（可复用）
│   │   ├── CustomTabbar.vue    # 底部导航栏
│   │   └── YearMonthPicker.vue # 年月选择器（可复用）
│   ├── config/
│   │   └── index.ts            # 应用配置（API地址/tokenKey）
│   ├── pages/                  # 页面目录
│   │   ├── splash/             # 开屏广告页
│   │   ├── login/              # 登录页
│   │   ├── register/           # 注册页
│   │   ├── detail/             # 明细页模块
│   │   │   ├── index.vue       # 明细首页（月份切换+记账列表）
│   │   │   ├── bill.vue        # 账单明细页
│   │   │   ├── fire-progress.vue  # FIRE进度页
│   │   │   ├── function-list.vue  # 功能列表（拖拽排序）
│   │   │   ├── components/     # 明细页子组件
│   │   │   │   ├── BillCard.vue        # 日期分组记录卡片
│   │   │   │   ├── DetailHeader.vue    # 头部区域（年月+汇总）
│   │   │   │   ├── FunctionBar.vue     # 功能快捷入口栏
│   │   │   │   └── SavingsRateCard.vue # 储蓄率卡片
│   │   │   └── budget/         # 预算模块
│   │   │       ├── index.vue           # 预算总览
│   │   │       ├── budget-setting.vue  # 预算设置
│   │   │       └── components/
│   │   ├── record/             # 记账页面
│   │   │   ├── index.vue              # 记账主入口
│   │   │   ├── edit-record.vue        # 编辑/新建记录
│   │   │   └── components/            # 记账组件
│   │   │       ├── AccountSelector.vue      # 账户选择器
│   │   │       ├── AccountSelectorPopup.vue # 账户选择弹窗
│   │   │       ├── AssetFields.vue          # 折旧资产字段
│   │   │       ├── CategorySelector.vue     # 分类选择器
│   │   │       ├── DatePicker.vue           # 日期选择器
│   │   │       ├── RecordConfirmCard.vue    # 记账确认卡片
│   │   │       └── TransactionForm.vue      # 交易表单
│   │   ├── my/                 # 我的页面
│   │   │   ├── index.vue              # 个人中心
│   │   │   ├── category-group-list.vue # 分类大类列表
│   │   │   ├── category-list.vue       # 子分类列表
│   │   │   └── account-setting/       # 账户设置
│   │   │       ├── account-list.vue   # 账户列表
│   │   │       └── account-edit.vue   # 新增/编辑账户
│   │   ├── analysis/           # 分析页
│   │   └── statistics/         # 统计页
│   ├── stores/                 # Pinia 状态管理
│   │   ├── functionItems.ts    # 功能入口排序状态
│   │   └── user.ts             # 用户认证状态
│   ├── types/                  # TypeScript 类型定义
│   │   ├── account.ts          # 账户类型（5种 + 还款方式）
│   │   └── asset.ts            # 资产类型
│   ├── utils/                  # 工具函数
│   │   ├── countdown.ts        # 倒计时
│   │   ├── navigate.ts         # 导航
│   │   ├── storage.ts          # 存储
│   │   └── validate.ts         # 表单验证
│   ├── static/
│   │   ├── logo.png
│   │   └── iconfont/           # 56 个分类图标字体
│   └── pages.json              # 路由配置
├── docs/
│   ├── DEVELOPER_HANDBOOK.md   # ✅ 本文档（你正在看）
│   └── requirements/           # 需求文档（按模块—子模块分类）
└── .trae/                      # Trae 任务规范
```

### 2.3 页面路由速查

| 路径 | 说明 | 需求文档 |
|------|------|---------|
| `pages/splash/index` | 开屏广告页 | - |
| `pages/login/index` | 登录页 | `04-系统配置/user-auth.md` |
| `pages/register/index` | 注册页 | `04-系统配置/user-auth.md` |
| `pages/detail/index` | **明细首页**（核心功能） | `01-记账省心/detail/detail-list.md` |
| `pages/detail/bill` | 账单明细页 | - |
| `pages/detail/fire-progress` | FIRE进度页 | `01-记账省心/detail/fire-progress.md` |
| `pages/detail/function-list` | 功能列表（拖拽排序） | - |
| `pages/detail/budget/index` | 预算列表页 | `04-系统配置/budget-setting/budget-progress.md` |
| `pages/detail/budget/budget-setting` | 预算设置页 | `04-系统配置/budget-setting/budget-setting.md` |
| `pages/record/index` | 记账主入口 | `01-记账省心/record/record.md` |
| `pages/record/edit-record` | 编辑/新建记录 | `01-记账省心/record/record.md` |
| `pages/statistics/index` | 月度统计页 | - |
| `pages/analysis/index` | 分析页 | - |
| `pages/my/index` | 我的页面 | `04-系统配置/settings.md` |
| `pages/my/category-group-list` | 分类大类列表 | `04-系统配置/category-group.md` |
| `pages/my/category-list` | 子分类列表 | `04-系统配置/category-setting/category-protect-and-ui.md` |
| `pages/my/account-setting/account-list` | 账户列表 | `04-系统配置/account-setting/account-list.md` |
| `pages/my/account-setting/account-edit` | 账户编辑 | `04-系统配置/account-setting/account-edit.md` |

### 2.4 后端项目结构 (firelifes_back)

#### 分层架构

```
┌─────────────────────────────────┐
│     Controller (控制器层)        │  ← 处理 HTTP 请求
├─────────────────────────────────┤
│      Service (业务逻辑层)       │  ← 核心业务逻辑
├─────────────────────────────────┤
│    Entity / Repository (数据层) │  ← 数据库操作
└─────────────────────────────────┘
```

#### 中间件链（执行顺序）

```
CorsMiddleware → ReportMiddleware → JwtMiddleware → 路由处理
  (最先执行)        (日志)            (认证)
```

#### 目录结构

```
firelifes_back/
├── src/
│   ├── config/                 # 多环境配置
│   │   ├── config.default.ts   # 默认配置
│   │   ├── config.local.ts     # 本地开发 (PORT=7001, DB=firelifes_dev)
│   │   ├── config.sit.ts       # SIT 测试 (PORT=7001, DB=firelifes_sit)
│   │   ├── config.prod.ts      # 生产环境 (PORT=7001, DB=firelifes_prod)
│   │   └── config.unittest.ts  # 单元测试
│   ├── controller/             # 控制器层
│   │   ├── account/            # 账户管理
│   │   │   └── account.controller.ts
│   │   ├── auth/               # 认证（登录/注册/短信）
│   │   │   └── auth.controller.ts
│   │   ├── category/           # 分类管理
│   │   │   └── category.controller.ts
│   │   ├── record/             # 记账记录
│   │   │   └── record.controller.ts
│   │   ├── user/               # 用户管理
│   │   │   └── user.controller.ts
│   │   ├── ad.controller.ts    # 广告管理
│   │   ├── api.controller.ts   # API 文档
│   │   ├── budget.controller.ts # 预算管理
│   │   └── home.controller.ts  # 首页
│   ├── service/                # 业务逻辑层
│   │   ├── account.service.ts  # 账户业务（默认账户创建）
│   │   ├── ad.service.ts       # 广告业务
│   │   ├── auth.service.ts     # 认证业务（JWT生成/验证）
│   │   ├── budget.service.ts   # 预算业务
│   │   ├── category.service.ts # 分类业务（43个默认分类初始化）
│   │   ├── net-worth.service.ts # 净资产计算
│   │   ├── record.service.ts   # 记账业务
│   │   ├── sms.service.ts      # 短信验证
│   │   └── user.service.ts     # 用户业务
│   ├── entity/                 # 数据实体层 (13个实体)
│   │   ├── account.entity.ts           # 账户
│   │   ├── ad.entity.ts                # 广告
│   │   ├── budget.entity.ts            # 预算
│   │   ├── category.entity.ts          # 分类
│   │   ├── category_group.entity.ts    # 分类分组
│   │   ├── depreciating_asset.entity.ts # 折旧资产
│   │   ├── icon.entity.ts              # 图标
│   │   ├── record.entity.ts            # 记账记录
│   │   ├── sms_code.entity.ts          # 短信验证码
│   │   ├── user.entity.ts              # 用户
│   │   ├── user_category_customization.entity.ts # 用户自定义分类
│   │   ├── user_category_group.entity.ts         # 用户分类分组
│   │   └── user_icon.entity.ts                  # 用户图标
│   ├── middleware/             # 中间件 (3个)
│   │   ├── cors.middleware.ts  # CORS 跨域处理（最先执行）
│   │   ├── jwt.middleware.ts   # JWT 认证
│   │   └── report.middleware.ts # 请求日志
│   ├── filter/                 # 异常过滤器
│   │   ├── default.filter.ts   # 全局异常处理
│   │   └── notfound.filter.ts  # 404 处理
│   ├── configuration.ts        # 主配置（中间件链注册）
│   └── interface.ts            # 接口类型定义
├── API.md                      # API 文档
├── ARCHITECTURE.md             # 架构文档
├── bootstrap.js                # 启动入口
└── package.json
```

### 2.5 数据库关系图

```
User (用户表)
  ├─ 1:N → Record (记账记录)
  ├─ 1:N → Budget (预算)
  ├─ 1:N → Account (账户)
  ├─ 1:N → UserCategoryCustomization (用户自定义分类)
  ├─ 1:N → UserCategoryGroup (用户分类分组)
  ├─ 1:N → UserIcon (用户图标)
  └─ 1:N → DepreciatingAsset (折旧资产)

Category (分类表)
  ├─ N:1 → CategoryGroup (分类分组)
  ├─ N:1 → Icon (图标)
  └─ 1:N → Record (记账记录)

Budget (预算表)
  └─ 与分类/分类组关联，支持预算消费扣减

Account (账户表)
  └─ 5种类型：cash / investment / fixed_asset / depreciable_asset / liability

SmsCode (短信验证码表)
  └─ 与 User 关联，5分钟有效期
```

### 2.6 API 响应格式

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
- `204` - OPTIONS 预检（CORS）
- `400` - 客户端错误
- `401` - 未授权
- `403` - 禁止访问
- `404` - 资源不存在
- `500` - 服务器错误

### 2.7 开发路径速查

#### 前端路径

```
# 明细页（核心首页）
页面:       src/pages/detail/index.vue
组件:       src/pages/detail/components/{DetailHeader,FunctionBar,BillCard,SavingsRateCard}.vue
状态:       src/stores/functionItems.ts
图标:       src/static/iconfont/iconfont.css
需求文档:   docs/requirements/01-记账省心/detail/detail-list.md

# 记账相关
页面:       src/pages/record/{index,edit-record}.vue
组件:       src/pages/record/components/{CategorySelector,AccountSelector,TransactionForm}.vue
API:        src/api/record.ts
需求文档:   docs/requirements/01-记账省心/record/record.md

# 我的页面
页面:       src/pages/my/index.vue
子页面:     src/pages/my/{category-group-list,category-list}.vue
需求文档:   docs/requirements/04-系统配置/

# 账户设置
页面:       src/pages/my/account-setting/{account-list,account-edit}.vue
类型:       src/types/account.ts
API:        src/api/account.ts
需求文档:   docs/requirements/04-系统配置/account-setting/

# 预算设置
页面:       src/pages/detail/budget/
API:        src/api/budget.ts
需求文档:   docs/requirements/04-系统配置/budget-setting/

# FIRE相关
页面:       src/pages/detail/fire-progress.vue
需求文档:   docs/requirements/01-记账省心/detail/{fire-progress,savings-rate}.md
```

#### 后端路径

```
# 记账相关
控制器:     src/controller/record/record.controller.ts
服务:       src/service/record.service.ts
实体:       src/entity/record.entity.ts

# 账户管理
控制器:     src/controller/account/account.controller.ts
服务:       src/service/account.service.ts
实体:       src/entity/account.entity.ts

# 预算相关
控制器:     src/controller/budget.controller.ts
服务:       src/service/budget.service.ts
实体:       src/entity/budget.entity.ts

# 分类管理
控制器:     src/controller/category/category.controller.ts
服务:       src/service/category.service.ts (43个默认分类)
实体:       src/entity/{category,category_group,icon,user_category_customization,user_category_group,user_icon}.entity.ts

# 认证
控制器:     src/controller/auth/auth.controller.ts
服务:       src/service/{auth,sms}.service.ts
实体:       src/entity/{user,sms_code}.entity.ts
中间件:     src/middleware/{cors,jwt,report}.middleware.ts

# 配置
主配置:     src/configuration.ts        (中间件链: Cors→Report→JWT)
环境配置:   src/config/config.*.ts
入口:       bootstrap.js
```

---

## 第三部分：分类图标映射 (CATEGORY_ICON_MAP)

### 3.1 概述

项目使用 **iconfont 字体图标** (`src/static/iconfont/`) 为 43 个默认分类提供图标。`CATEGORY_ICON_MAP` 出现在 **4 个文件**中，将分类中文名映射为 iconfont CSS 类名：

| 文件 | 用途 |
|------|------|
| `src/pages/detail/index.vue` | 明细页记录行图标 |
| `src/pages/record/components/CategorySelector.vue` | 记账页分类选择器 |
| `src/pages/detail/budget/budget-setting.vue` | 预算设置页 |
| `src/pages/statistics/index.vue` | 统计页 |

### 3.2 完整映射表（按 10 大分组）

**饮食消费**：`餐饮→icon-canyin`、`饮料/水果/零食/咖啡→icon-lingshi`

**居家居住**：`住房/居家→icon-fangzi`、`维修→icon-wj-zd`、`快递→icon-qitadingdan`

**交通出行**：`交通→icon-jiaotong`、`汽车→icon-qiche`

**形象与消费**：`服饰→icon-yifu`、`美发/美容→icon-meirong`、`购物→icon-gouwuche`

**兴趣与成长**：`运动/健身→icon-yundong-`、`旅行→icon-lvhang`、`书籍/学习/教育→icon-jiaoyu`、`娱乐/电影/音乐/游戏→icon-youxiyouxiji`

**社交关系**：`社交/亲友→icon-13`、`礼物/捐赠→icon-jiangjinjilu`、`礼金→icon-a-068_lijin`、`宠物→icon-xiedaichongwu`

**健康与医疗**：`医疗→icon-yiliao`

**职场工作**：`办公→icon-shezhi`、`通讯→icon-shouji`

**金融理财**：`投资/彩票→icon-licaishouyi`

**其他**：`其他→icon-qita`、`日用/日用品→icon-riyongpin`

**收入**：`工资→icon-gongzijianyi`、`奖金→icon-jiangjinxiangqing`、`兼职→icon-a-068_jianzhi`、`投资收入/理财/理财收益→icon-licaishouyi`、`报销/退款→icon-tuikuan`、`礼金收入→icon-a-068_lijin`、`其他收入→icon-qita`

> ⚠️ **重要**：新增或修改分类名称时，必须同步更新 4 个文件中的 `CATEGORY_ICON_MAP`，确保所有页面图标一致显示。

---

## 第四部分：设计规范（小米汽车蓝）

### 4.1 色彩系统

#### 主色 - 卡布里蓝

| 用途 | 色值 | 说明 |
|------|------|------|
| 主色/品牌色 | `#00BFFF` | 卡布里蓝 - 清新科技感 |
| 主色渐变 | `linear-gradient(135deg, #00BFFF 0%, #0099CC 100%)` | 导航/重点区域 |
| 主色浅背景 | `rgba(0, 191, 255, 0.08)` | 图标底色/选中态 |

#### 账户类型色条（卡片左侧 6rpx 竖线）

| 类型 | 色值 | 说明 |
|------|------|------|
| 现金类 cash | `#00BFFF` | 卡布里蓝 |
| 投资类 investment | `#FF9800` | 活力橙 |
| 固定资产类 fixed_asset | `#9C27B0` | 尊贵紫 |
| 折旧资产类 depreciable_asset | `#00BCD4` | 青蓝色 |
| 负债类 liability | `#FA3534` | 警示红 |

#### 功能色

| 色值 | 用途 |
|------|------|
| `#19BE6B` | 资产类余额、收入Badge、储蓄率正向 |
| `#FA3534` | 错误/删除/负债余额 |
| `#FF9800` | 投资类标识 |
| `#FAAD14` | 警告/预警 |

#### 中性色

| 色值 | 用途 |
|------|------|
| `#FFFFFF` | 白色/卡片背景 |
| `#F0F2F5` | 页面底色 |
| `#F5F7FA` | 卡片按压态 |
| `#333333` | 主要文案 |
| `#666666` | 次级文案 |
| `#999999` | 辅助文案 |
| `#CCCCCC` | 占位/禁用/箭头 |

### 4.2 圆角规范

| 尺寸 | 用途 |
|------|------|
| `8rpx` | 小按钮、小标签、Badge |
| `16rpx` | 卡片、弹窗 |
| `20rpx` | 账户卡片、BillCard |
| `24rpx` | 大卡片、资产区 |

### 4.3 间距规范

| 尺寸 | 用途 |
|------|------|
| `8rpx` | 极小间距 |
| `12rpx` | 元素间间距 |
| `16rpx` | 小间距、卡片间距 |
| `20rpx` | 图标间距 |
| `24rpx` | 标准页面间距 |
| `32rpx` | 大间距、区块间距 |

### 4.4 阴影规范

| 级别 | 阴影 | 用途 |
|------|------|------|
| 轻阴影 | `0 4rpx 12rpx rgba(0,0,0,0.04)` | 卡片默认 |
| 中阴影 | `0 8rpx 24rpx rgba(0,0,0,0.08)` | 悬浮/强调 |
| 功能栏 | `0 4rpx 16rpx rgba(0,0,0,0.06)` | FunctionBar 底部 |

### 4.5 卡片设计原则

1. 白色背景 + `20rpx` 圆角 + 轻阴影
2. 内边距 `24rpx-32rpx`
3. 清晰的信息层级（图标→名称→Badge→金额）
4. 点击有缩放反馈（`:active` → `scale(0.985)` + 背景 `#F5F7FA`）
5. 左滑操作使用 `WdSwipeAction`（非 WdSwipeCell）

---

## 第五部分：文案规范

### 5.1 页面标题规范

| 页面路径 | 入口文案 | 页面标题 |
|---------|---------|---------|
| `/pages/my/category-group-list` | 分类设置 | 分类设置 |
| `/pages/my/account-setting/account-list` | 账户设置 | 我的账户 |
| `/pages/my/account-setting/account-edit` | - | 编辑账户 / 新增账户 |
| `/pages/detail/function-list` | 更多 | 功能页 |
| `/pages/detail/budget/index` | - | 预算 |
| `/pages/detail/budget/budget-setting` | - | 预算设置 |
| `/pages/detail/fire-progress` | - | FIRE进度 |
| `/pages/detail/bill` | - | 账单汇总 |

### 5.2 常用文案标准

| 场景 | 标准文案 |
|------|---------|
| 删除确认 | 确定要删除「{{ name }}」吗？删除后不可恢复。 |
| 保存成功 | 保存成功 |
| 删除成功 | 已删除「{{ name }}」 |
| 空状态 | 还没有添加账户 / 暂无记账记录 |
| 加载态 | 骨架屏（shimmer 动画）/ 加载中... |

---

## 第六部分：开发规范

### 6.1 生命周期函数导入规范

| 来源 | 函数 |
|------|------|
| `vue` | `onMounted`, `onUnmounted`, `onUpdated`, `onBeforeMount`, `onBeforeUnmount`, `ref`, `computed`, `reactive`, `watch` |
| `@dcloudio/uni-app` | `onShow`, `onHide`, `onLoad`, `onUnload`, `onReachBottom`, `onPullDownRefresh`, `onShareAppMessage` |

```typescript
import { ref, computed, onMounted, watch } from 'vue'
import { onShow } from '@dcloudio/uni-app'
```

### 6.2 WotUI 组件使用规范

- 模板中使用 PascalCase：`<WdNavbar>`、`<WdSwipeAction>`、`<WdDialog>`
- 自动按需导入（`@uni-helper/vite-plugin-uni-components`），**不需**手动 import
- ⚠️ 项目使用 `WdSwipeAction`，非 `WdSwipeCell`

#### 常用 WotUI 组件

| 组件 | 用途 |
|------|------|
| `WdNavbar` | 导航栏（`leftArrow`,`fixed`,`placeholder`,`bordered`,`safeAreaInsetTop`） |
| `WdSwipeAction` | 左滑操作（`:right-width`, `#default`, `#right`） |
| `WdButton` | 按钮（`type="primary"/"danger"`, `size="small"`） |
| `WdDialog` | 对话框（`v-model`,`show-cancel-button`,`show-confirm-button`,`@confirm`） |
| `WdInput` | 输入框 |
| `WdPopup` | 弹出层 |
| `WdPickerView` | 选择器视图 |

### 6.3 编码规范

#### TypeScript
- 严格模式，避免 `any`
- 接口类型定义放在 `api/` 或 `types/` 目录

#### Vue 3 Composition API
- `<script setup lang="ts">` 语法
- `ref`/`computed`/`reactive` 响应式 API

#### CSS
- `rpx` 单位（1rpx ≈ 0.5px on 375-width screen）
- 页面容器 `overflow-x: hidden`（避免与 WdSwipeAction 冲突）
- 安全区域：`padding-bottom: env(safe-area-inset-bottom)`

### 6.4 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 组件文件 | PascalCase + .vue | `DetailHeader.vue` |
| 页面文件 | kebab-case | `account-list.vue` |
| 组件名 | PascalCase | `<DetailHeader>` |
| 变量/函数 | camelCase | `loadMonthData` |
| 常量 | UPPER_SNAKE_CASE | `CATEGORY_ICON_MAP` |
| 后端控制器 | PascalCase + Controller | `RecordController` |
| 后端服务 | PascalCase + Service | `RecordService` |

### 6.5 Git 规范

- 分支：`main`
- 提交信息：`feat:` / `fix:` / `docs:` / `style:` / `refactor:` / `test:` / `chore:`

### 6.6 需求文档组织规范

```
docs/requirements/
├── 01-记账省心/
│   ├── detail/      ← 明细页子模块（月份切换/FIRE进度/储蓄率）
│   └── record/      ← 记账功能子模块
├── 02-资产有数/
├── 03-FIRE可期/
│   └── fire-*.md    ← FIRE目标/反馈/时间换算/月度报告
└── 04-系统配置/
    ├── budget-setting/    ← 预算设置/进度/双体系
    ├── account-setting/   ← 账户列表/编辑/负债规则
    └── category-setting/  ← 分类大类/子分类管理
```

### 6.7 常见问题与解决方案

#### 7001 端口被占用（EADDRINUSE）
- `npm run dev` 的 node 进程可能在终端关闭后未退出
- **快速修复**：`lsof -ti :7001 | xargs kill -9`
- **快捷命令**：`npm run kill`（已配置在 package.json）
- **根本原因**：退出终端前先 `Ctrl+C` 停止进程
- **排查**：`lsof -iTCP:7001 -sTCP:LISTEN` 查看谁在监听

#### 前端跨域报「网络错误」
- 确保后端 CorsMiddleware 已正确注册并在中间件链最前面
- 验证：`curl -s -I -X OPTIONS -H "Origin: http://localhost:5173" http://localhost:7001/record/month-summary`
- 应返回 `HTTP/1.1 204 No Content` + CORS 响应头

#### CATEGORY_ICON_MAP 图标不显示
- 检查 4 个文件中的映射表是否同步更新
- iconfont 类名必须与 `src/static/iconfont/iconfont.css` 中完全一致
- 兜底机制：`CATEGORY_ICON_MAP[name] || userIconsMap.get(iconId) || cat.iconUrl || 'icon-qita'`

#### WdSwipeAction 左滑不生效
- 页面容器必须 `overflow-x: hidden`
- 必须使用正确 slot：`#default` 和 `#right`
- 禁止手动 import WotUI 组件

---

## 第七部分：代码审查清单

### 7.1 UI/UX 检查项

- [ ] 页面入口菜单文案与页面标题一致
- [ ] 导航栏统一使用 `WdNavbar`
- [ ] 弹窗统一使用 `WdDialog`（非 `uni.showModal`）
- [ ] 所有页面有返回功能
- [ ] 加载状态用骨架屏（非纯文字）
- [ ] 空状态有图标+引导文案
- [ ] 操作成功/失败有 toast 反馈

### 7.2 代码质量检查项

- [ ] 类型定义完整，避免 `any`
- [ ] `CATEGORY_ICON_MAP` 4 个文件同步更新
- [ ] 新增分类名时 iconfont.css 中有对应类名
- [ ] 生命周期函数从正确来源导入
- [ ] 遵循现有目录结构，文件放在正确位置

### 7.3 功能检查项

- [ ] 新增/修改/删除/查询功能正常
- [ ] CORS 预检请求返回 204
- [ ] 需求文档已同步更新
- [ ] 边界情况已覆盖（空数据、未登录、网络错误）

---

## 第八部分：版本历史

| 版本 | 日期 | 变更内容 | 作者 |
|------|------|---------|------|
| v2.0 | 2026-05-21 | 全面刷新：补充13个实体/3个中间件/CORS规范、新增CATEGORY_ICON_MAP章节、账户类型色条、文档组织结构、路由速查补全、FAQ补充 | AI |
| v1.0 | 2026-05-20 | 初始版本 | AI |
