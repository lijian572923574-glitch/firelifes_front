# FIRE生活家 - 开发者手册

> **版本**: v1.0 | **最后更新**: 2026-05-20
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

### 1.3 三大核心模块

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

### 1.6 预算功能 - 双预算体系

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

#### 预算消费扣减流程

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

---

## 第二部分：技术栈与项目结构

### 2.1 技术栈总览

#### 前端技术栈

```
框架:     Vue 3 + TypeScript
UI组件:   Wot Design Uni
构建:     UniApp (支持微信小程序/H5)
样式:     SCSS
状态管理: Pinia
路由:     pages.json 配置
```

#### 后端技术栈

```
框架:     Midway.js v4 (基于 Koa)
ORM:      TypeORM v0.3.28
数据库:   PostgreSQL
认证:     JWT + bcrypt
验证:     Joi
配置管理: dotenv (支持多环境)
```

#### 部署目标
- 微信小程序
- H5 移动端网页

### 2.2 前端项目结构 (firelifes_front)

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
│   ├── DEVELOPER_HANDBOOK.md   # ✅ 本文档（你正在看）
│   └── requirements/           # 需求文档（按模块分类）
└── .trae/                      # Trae 任务规范
```

### 2.3 页面路由速查

| 路径 | 说明 |
|------|------|
| `pages/detail/index` | 明细首页（预算进度总览） |
| `pages/detail/budget/index` | 预算列表页 |
| `pages/detail/budget/budget-setting` | 预算设置页 |
| `pages/detail/bill` | 账单明细页 |
| `pages/detail/fire-progress` | FIRE进度页 |
| `pages/record/edit-record` | 记账编辑页 |
| `pages/my/index` | 我的页面 |

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

#### 目录结构

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
├── ARCHITECTURE.md             # 架构文档（已整合）
└── bootstrap.js                # 启动入口
```

### 2.5 数据库关系图

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
- `400` - 客户端错误
- `401` - 未授权
- `403` - 禁止访问
- `404` - 资源不存在
- `500` - 服务器错误

### 2.7 开发路径速查

#### 前端路径

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

#### 后端路径

```
# 预算相关
控制器:     src/controller/budget.controller.ts
服务:       src/service/budget.service.ts
实体:       src/entity/budget.entity.ts

# 记账相关
控制器:     src/controller/record.controller.ts
服务:       src/service/record.service.ts
实体:       src/entity/record.entity.ts

# 短信验证相关
控制器:     src/controller/auth/auth.controller.ts
服务:       src/service/sms.service.ts
实体:       src/entity/sms_code.entity.ts
API接口:    POST /auth/send-sms

# 配置
配置文件:   src/config/config.*.ts
API文档:    API.md
```

---

## 2.5 短信验证服务

### 业务流程

```
用户点击「获取验证码」
    ↓
前端调用 POST /auth/send-sms
    ↓
后端接收手机号和验证码类型
    ↓
✅ 频率检查：60秒内不能重复发送
✅ 日限检查：每天最多100条
    ↓
生成 6 位数字验证码
    ↓
存入 sms_codes 表（手机号、验证码、类型、过期时间、使用状态）
    ↓
调用 Spug 推送 API 发送短信
    ↓
返回成功响应（开发环境同时在控制台输出验证码）
```

### Spug 推送 API

**接口地址：**
```
GET https://push.spug.cc/send/{apiKey}?code={验证码}&targets={手机号}
```

**参数说明：**
| 参数 | 说明 | 示例 |
|------|------|------|
| apiKey | Spug 推送密钥 | `ApaWxrRQeqj7YLGB` |
| code | 6位数字验证码 | `123456` |
| targets | 手机号，多个用逗号分隔 | `18682028219` |

**配置方式：**
- 配置文件：`src/config/config.*.ts` 中的 `spugSms.apiKey`
- 环境变量：`SPUG_SMS_API_KEY`
- 默认值：`ApaWxrRQeqj7YLGB`

### 数据库表结构 (sms_codes)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | int | 主键自增 |
| phone | varchar(20) | 手机号 |
| code | varchar(10) | 6位验证码 |
| type | enum | 类型：register/login/reset-password |
| expires_at | timestamp | 过期时间（5分钟后） |
| used | boolean | 是否已使用 |
| created_at | timestamp | 创建时间 |

### 安全机制

| 限制 | 值 | 说明 |
|------|----|------|
| 发送间隔 | 60秒 | 同一手机号60秒内不能重复发送 |
| 日发送上限 | 100条 | 防止恶意刷短信 |
| 有效期 | 5分钟 | 验证码5分钟后自动失效 |
| 一次性 | 验证后立即标记为已使用 |

---

## 第三部分：设计规范（小米汽车蓝）

### 3.1 色彩系统

#### 主色 - 小米汽车蓝

| 用途 | 色值 | 说明 |
|------|------|------|
| 主色/品牌色 | `#00BFFF` | 小米汽车蓝 - 清新科技感 |
| 主色渐变 | `linear-gradient(135deg, #00BFFF 0%, #0099CC 100%)` | 常用渐变 |

#### 主色透明度变体

| 透明度 | 色值 | 用途 |
|--------|------|------|
| 100% | `#00BFFF` | 主按钮、强调色 |
| 80% | `rgba(0, 191, 255, 0.8)` | 次级强调 |
| 50% | `rgba(0, 191, 255, 0.5)` | 背景强调 |
| 20% | `rgba(0, 191, 255, 0.2)` | 轻量背景 |
| 10% | `rgba(0, 191, 255, 0.1)` | 极轻背景 |

#### 中性色

| 色值 | 用途 |
|------|------|
| `#FFFFFF` | 白色/卡片背景 |
| `#F8F9FA` | 页面背景 |
| `#F0F2F5` | 分割线/次级背景 |
| `#666666` | 次级文案 |
| `#999999` | 辅助文案 |
| `#CCCCCC` | 占位/禁用 |
| `#333333` | 主要文案 |

#### 功能色

| 色值 | 用途 |
|------|------|
| `#FA3534` | 错误/删除/警示 |
| `#52C41A` | 成功 |
| `#FAAD14` | 警告 |

### 3.2 圆角规范

| 尺寸 | 用途 |
|------|------|
| `8rpx` | 小按钮、小标签 |
| `16rpx` | 卡片、弹窗 |
| `24rpx` | 大按钮、大卡片 |

### 3.3 间距规范

| 尺寸 | 用途 |
|------|------|
| `8rpx` | 极小间距 |
| `16rpx` | 小间距 |
| `24rpx` | 标准间距 |
| `32rpx` | 大间距 |

### 3.4 阴影规范

| 级别 | 阴影 | 用途 |
|------|------|------|
| 轻阴影 | `0 4rpx 12rpx rgba(0, 0, 0, 0.04)` | 卡片默认 |
| 中阴影 | `0 8rpx 24rpx rgba(0, 0, 0, 0.08)` | 悬浮/强调 |

### 3.5 卡片设计原则

1. 白色背景 + 圆角 + 轻阴影
2. 适当的内边距（24rpx-32rpx）
3. 清晰的信息层级
4. 点击有缩放反馈

---

## 第四部分：文案规范

### 4.1 命名一致性规范

#### 页面入口与标题一致性

- **规则**：页面入口菜单文案必须与页面标题文案完全一致
- **示例**：
  - 入口菜单：`分类设置` → 页面标题：`分类设置` ✓
  - 入口菜单：`账户设置` → 页面标题：`账户设置` ✓
  - 入口菜单：`分类设置` → 页面标题：`分类管理` ✗

#### 常用文案标准

| 场景 | 标准文案 | 说明 |
|------|---------|------|
| 分类分组管理 | 分类设置 | 个人中心入口 |
| 账户管理 | 账户设置 | 个人中心入口 |
| 确认删除 | 确定要删除吗？ | 删除确认弹窗 |
| 保存成功 | 保存成功 | 操作成功提示 |
| 删除成功 | 删除成功 | 操作成功提示 |
| 新增成功 | 新增成功 | 操作成功提示 |
| 编辑成功 | 编辑成功 | 操作成功提示 |

### 4.2 页面文案清单

#### 个人中心模块

| 页面路径 | 入口文案 | 页面标题 | 状态 |
|---------|---------|---------|------|
| `/pages/my/index` | - | - | 首页 |
| `/pages/my/category-group-list` | 分类设置 | 分类设置 | ✓ 已确认 |
| `/pages/my/category-list` | - | 动态显示分组名 | ✓ |
| `/pages/my/account-setting/account-list` | 账户设置 | 账户设置 | ✓ 已修复 |
| `/pages/my/account-setting/account-edit` | - | 编辑账户/新增账户 | ✓ |

---

## 第五部分：开发规范

### 5.1 生命周期函数导入规范

#### Vue 组件生命周期（从 vue 导入）
- `onMounted`
- `onUnmounted`
- `onUpdated`
- `onBeforeMount`
- `onBeforeUnmount`

#### UniApp 页面生命周期（从 @dcloudio/uni-app 导入）
- `onShow`
- `onHide`
- `onLoad`
- `onUnload`
- `onReachBottom`
- `onPullDownRefresh`
- `onShareAppMessage`

#### 正确示例

```typescript
import { ref, computed, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
```

### 5.2 WotUI 组件使用规范

#### 组件名规则
- 组件在模板中使用大写开头，如：`<WdNavbar>`、`<WdSwipeAction>`
- 组件自动通过 `@uni-helper/vite-plugin-uni-components` 按需导入
- **不需要**手动 import 组件

#### 实际组件列表

| 需求文档 | 实际组件 |
|---------|---------|
| WdSwipeCell | WdSwipeAction |

#### 常用 WotUI 组件

- WdNavbar - 导航栏
- WdSwipeAction - 左滑操作
- WdButton - 按钮
- WdIcon - 图标
- WdDialog - 对话框
- WdInput - 输入框
- WdLoading - 加载
- WdCell - 单元格
- WdCellGroup - 单元格组
- WdPopup - 弹出层
- WdPickerView - 选择器视图

### 5.3 编码规范

#### TypeScript
- 使用 TypeScript 严格模式
- 避免使用 `any` 类型
- 接口类型定义放在 `api/` 目录下

#### Vue 3 Composition API
- 使用 `<script setup lang="ts">` 语法
- 使用 `ref`、`computed` 响应式 API
- 使用组合式函数复用逻辑

#### CSS
- 使用 rpx 单位适配
- 页面容器设置 `min-height: 100vh`
- 注意安全区域适配 `padding-bottom: env(safe-area-inset-bottom)`

### 5.4 命名规范

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

### 5.5 Git 规范

- 分支：`main` (主分支)
- 提交信息：使用语义化提交
  - `feat:` 新功能
  - `fix:` 修复bug
  - `docs:` 文档更新
  - `style:` 代码格式
  - `refactor:` 重构
  - `test:` 测试
  - `chore:` 构建/工具

### 5.6 常见问题与解决方案

#### WdSwipeCell 不存在
- 实际组件是 `WdSwipeAction`
- 使用方式相同，只是名字不同

#### 左滑操作不生效
- 页面容器需要设置 `overflow-x: hidden`
- WdSwipeAction 需要设置正确的 slot：`#default` 和 `#right`

#### 组件导入错误
- 不要手动 import WotUI 组件
- 确保 vite.config.ts 配置了 `@uni-helper/vite-plugin-uni-components`
- 组件名使用 PascalCase（大写开头）

#### 7001 端口被占用（EADDRINUSE）
- 关闭终端后 `npm run dev` 的 node 进程可能未退出，持续占用 7001 端口
- 先查看占用进程：`lsof -i :7001`
- 强杀占用进程：`lsof -ti :7001 | xargs kill -9`
- 确认释放：`lsof -i :7001`（无输出即已释放）
- 然后重新执行 `npm run dev`
- **根本方案**：退出终端前先 `Ctrl+C` 停止 dev 进程，或使用 `pkill -f "midway"` 统一清理

---

## 第六部分：代码审查清单

### 6.1 UI/UX 检查项

#### 文案一致性
- [ ] 页面入口菜单文案与页面标题完全一致
- [ ] 按钮文案符合用户习惯（确认/取消/保存/删除）
- [ ] 提示文案清晰明确
- [ ] 查阅并遵循本文档「第四部分：文案规范」

#### 组件统一性
- [ ] 导航栏统一使用 `WdNavbar` 组件
- [ ] 按钮统一使用 `WdButton` 组件
- [ ] 弹窗统一使用 `WdDialog` 组件
- [ ] 输入框统一使用 `WdInput` 组件

#### 交互体验
- [ ] 所有页面都有返回功能
- [ ] 加载状态有明确提示
- [ ] 空状态有友好提示
- [ ] 操作成功/失败有反馈

### 6.2 代码质量检查项

#### TypeScript 规范
- [ ] 类型定义完整，避免使用 `any`
- [ ] 导入语句有序且无重复
- [ ] 变量/函数命名清晰易懂

#### Vue 规范
- [ ] 组件命名符合规范
- [ ] `setup` 语法使用正确
- [ ] 响应式数据使用 `ref`/`computed` 合理

#### 目录结构
- [ ] 新文件放在正确的目录下
- [ ] 遵循现有目录结构
- [ ] 不随意修改现有文件路径

### 6.3 功能检查项

#### 基础功能
- [ ] 新增功能正常工作
- [ ] 修改功能正常工作
- [ ] 删除功能正常工作
- [ ] 查询/列表功能正常工作

#### 边界情况
- [ ] 网络错误处理
- [ ] 数据为空处理
- [ ] 用户输入验证
- [ ] 权限控制（如需要）

### 6.4 提交前必须完成

- [ ] 本地完整测试通过
- [ ] 代码无 lint 错误
- [ ] 无控制台错误/警告
- [ ] 已阅读本文档并完成自查

---

## 第七部分：AI 开发指引

### 7.1 开发前必读

1. **先看文档**：开发功能前先阅读 `docs/requirements/` 下对应的需求文档
2. **参考现有代码**：类似功能参考已有实现（如预算参考记账）
3. **保持代码风格一致**：遵循项目现有代码风格和命名规范
4. **小步提交**：功能拆分，避免一次提交过多代码

### 7.2 新增功能步骤

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

### 7.3 问题排查

- **后端报错**: 检查终端日志，查看 Controller/Service 代码
- **前端报错**: 检查浏览器控制台，查看 API 请求和响应
- **数据库问题**: 检查 Entity 定义，确认数据库表结构
- **认证问题**: 检查 JWT Token 是否正确携带，Token 是否过期

### 7.4 关键业务流程速查

#### 记账流程

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

#### 预算设置流程

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

#### 认证流程

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

## 📝 变更记录

| 日期 | 变更内容 | 执行人 |
|------|---------|-------|
| 2026-05-20 | 整合 6 个文档为统一开发者手册，同时服务人类与 AI | AI |
| 2026-05-16 | 新增预算功能双预算体系设计 | AI |
| 2026-05-12 | 新增设计规范、文案规范、代码审查清单 | AI |
| 2026-05-09 | 初始产品架构文档 | AI |

---

## 📚 参考文件

- `src/pages/detail/index.vue` - 完整的页面示例
- `docs/requirements/` - 各模块详细需求文档
- `vite.config.ts` - Vite 配置
