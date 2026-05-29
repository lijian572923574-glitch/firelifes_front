# 账户编辑页
> 文件：`account-edit.md` | 中文名称：账户编辑 | 所属模块：系统配置（我的页面子模块）
> 页面路径：`pages/my/account-setting/account-edit.vue`

> 版本：v2.3 | 状态：已完成 | 最后更新：2026-05-29

## 版本历史
| 版本 | 日期 | 变更内容 | 作者 |
|------|------|---------|------|
| v2.3 | 2026-05-29 | **标题栏统一**：替换 WdNavbar → 自定义 gradient 标题栏，全设置页统一样式（主题色渐变背景 + 白色文字 + 左侧返回） | AI-全栈 |
| v2.2 | 2026-05-27 | 新增「账户调整记账联动」：新增/编辑账户时自动生成调整类型记账记录，差额驱动；全面修正色彩规范对齐 variables.css 变量体系 | AI |
| v2.1 | 2026-05-21 | 代码 UI 全面升级：卡片分区布局、图标预览区（112×112大图+说明）、类型卡片（彩色圆点+emoji）、余额 ¥|分隔线|输入、开关双行说明、页面底色 var(--color-bg-page)、TYPE_CONFIG 色值驱动 | AI |
| v2.0 | 2026-05-21 | 新增 Pencil 设计稿：`designs/my/account-setting/account-edit.pen`，完整可视化新增/编辑账户页面布局 | AI-UI设计 |
| v1.0 | 2026-05-09 | 从 account-system.md 拆分，账户编辑页独立需求 | AI |
| v1.1 | 2026-05-09 | 简化字段：只保留名称、类型、余额、说明、图标 | AI |
| v1.2 | 2026-05-09 | 添加默认账户：现金、折旧资产、固定资产 | AI |
| v1.3 | 2026-05-09 | 固定账户类型为5种：现金类、投资类、固定资产类、折旧资产类、负债类 | AI |
| v1.4 | 2026-05-10 | 与代码实现对齐：字段顺序、UI规范、数据结构、API | AI |
| v1.5 | 2026-05-10 | 引入WotUI组件：WdNavbar、WdInput、WdTextarea、WdButton | AI |
| v1.6 | 2026-05-10 | 负债类余额特殊处理：默认为负数、只允许负数、切换类型时自动转换 | AI |
| v1.7 | 2026-05-21 | 删除调整余额功能，余额直接在账户编辑页修改 | AI |
| v1.8 | 2026-05-21 | 新增「设为默认支出账户」和「设为默认收入账户」开关，支持记账时自动选中 | AI |
| v1.9 | 2026-05-21 | 限制只有现金类和负债类可以设为默认账户，其他类型自动隐藏开关并重置 | AI |

---

>  **Pencil 设计稿**: `designs/my/account-setting/account-edit.pen` — 在编辑器中使用 Pencil 插件打开，可视化查看新增/编辑账户页完整布局。

## 功能概述
账户编辑页支持新增账户和编辑两种模式，提供账户信息的基本维护功能。自 v2.2 起，新增/编辑账户保存后，若余额发生变化，自动生成一笔「调整」类型的记账记录，确保记账流水完整反映资产变动。

---

## 账户调整记账联动（v2.2 新增）

### 业务规则

| 场景 | 调整前余额 | 调整后余额 | 差额(amount) | RecordType | 备注自动生成 |
|------|-----------|-----------|-------------|------------|------------|
| 新增账户（余额>0） | 0 | +N | +N | adjustment_increase | "新建账户「账户名称」" |
| 新增账户（余额=0） | 0 | 0 | 0 | — | 不产生记录 |
| 新增负债账户 | 0 | -N | -N | adjustment_decrease | "新建负债账户「账户名称」" |
| 编辑账户（余额增加） | oldBalance | newBalance | +Δ | adjustment_increase | "调整账户「账户名称」" |
| 编辑账户（余额减少） | oldBalance | newBalance | -Δ | adjustment_decrease | "调整账户「账户名称」" |
| 编辑账户（余额不变） | oldBalance | oldBalance | 0 | — | 不产生记录 |

### 差额计算公式
- **新增模式**：`amount = balance`（balance 的符号决定 income/expense）
- **编辑模式**：`amount = newBalance - oldBalance`（正差→income，负差→expense）

### 调整记录数据结构
调整记录使用独立的 `RecordType: 'adjustment_increase' | 'adjustment_decrease'`，与常规收支（income/expense）区分：
- 差额 > 0 → `type: 'adjustment_increase'`
- 差额 < 0 → `type: 'adjustment_decrease'`
- 差额 = 0 → 跳过，不产生记录

调整记录关联字段：
- `accountId`：当前编辑的账户 ID
- `date`：当前系统时间
- `remark`：自动生成（"新建账户「名称」" / "调整账户「名称」"）
- `typeId`：不传（调整记录无需关联支出/收入分类）

> **设计意图**：调整记录使用独立 RecordType，确保后端 `month-summary` 等统计 API 仅对 `income`/`expense` 类型求和，调整金额不会污染月度收支汇总、年度账单、预算追踪、FIRE 储蓄率等核心指标。

### 交互流程
1. 用户点击保存
2. 前端调用 `createAccount` / `updateAccount` API
3. API 返回成功后，前端判断差额 `diff = newBalance - oldBalance`
4. 若 `diff !== 0`，前端调用 `createRecord` API 生成调整记录
5. 调整记录创建成功后 toast 提示，1.5s 后 navigateBack
6. 若调整记录创建失败，toast 提示"账户已保存，但调整记录生成失败"，仍 navigateBack

> **后端事务建议**：推荐后端在账户 API 内部使用数据库事务同时完成"更新账户 + 创建调整记录"的原子操作。前端降级为两步调用模式。

---

## 用户故事
作为用户，我希望能灵活添加和修改账户信息，这样我可以准确记录每个账户的财务状况。

## 交互设计

### 页面结构

```
新增/编辑账户页
┌────────────────────────────────────┐
│  ← 新增账户 / 编辑账户 (WdNavbar)  │
├────────────────────────────────────┤
│  ┌──────────────────────────────┐  │
│  │  ┌────┐                      │  │ ← 图标卡片（白底 24rpx 圆角）
│  │  │  │ 选择图标              │  │   大预览 112×112 + 说明文字
│  │  └────┘ 点击下方图标更换      │  │   下方 14 个小图标 80×80
│  │  [][][][][][][]│  │   选中项浅蓝底色高亮
│  │  [][][][][][][]│  │
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  账户类型                     │  │ ← 类型卡片（白底 24rpx 圆角）
│  │  ┌──────┐┌──────┐┌──────┐   │  │   5 种类型，3+2 两行
│  │  │●   ││●   ││●   │   │  │   彩色圆点 + emoji + 标签
│  │  │现金类 ││投资类 ││固定资产│   │  │   选中态彩色淡底
│  │  └──────┘└──────┘└──────┘   │  │
│  │  ┌──────┐┌──────┐            │  │
│  │  │●   ││●   │            │  │
│  │  │折旧  ││负债类 │            │  │
│  │  └──────┘└──────┘            │  │
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  账户名称                     │  │ ← 表单卡片（白底 24rpx 圆角）
│  │  [请输入账户名称            ] │  │   WdInput, 灰底色 #F5F6FA
│  │                               │  │
│  │  账户余额                     │  │
│  │  [¥ │ 0.00                  ] │  │   ¥符号 + 竖线分隔 + WdInput
│  │                               │  │
│  │  账户说明（选填）              │  │   WdTextarea
│  │  [                          ] │  │
│  └──────────────────────────────┘  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  默认支出账户        [开关]   │  │ ← 开关卡片（白底 24rpx 圆角）
│  │  记账时自动选中此账户用于支出  │  │   仅现金类/负债类可见
│  │  ─────────────────────────── │  │   双行说明 + WdSwitch
│  │  默认收入账户        [开关]   │  │
│  │  收入记账时自动选中此账户      │  │
│  └──────────────────────────────┘  │
│                                     │
│  ┌────────────────────────────────┐ │
│  │          [ 保 存 ]             │ │ ← WdButton, 96rpx 高度, 圆角 12rpx
│  └────────────────────────────────┘ │
└────────────────────────────────────┘
```

### 页面模式

- **新增模式**：标题显示"新增账户"，所有字段为空，图标默认选中，类型默认现金类，保存后创建新账户
- **编辑模式**：标题显示"编辑账户"，通过路由参数 `id` 加载已有账户数据并填充表单，保存后更新

### 表单字段与验证

| 字段 | 必填 | 验证规则 | 说明 |
|------|------|---------|------|
| 账户图标 | ⭕ | 14个预设图标选一 | 新增模式默认，编辑模式加载已有图标 |
| 账户名称 |  | 1-20字符 | 非空且不超过20字符 |
| 账户类型 |  | 五选一 | 彩色圆点+emoji+标签卡片，上3下2两行，选中态显示类型对应淡色背景 |
| 账户余额 |  | 数字，最多2位小数 | ¥前缀，输入时正则校验 `/^\d*\.?\d{0,2}$/`，负债类传负数 |
| 设为默认支出账户 | ⭕ | 开关 | **仅现金类/负债类可用**。开启后记账时默认选中此账户，同一类型最多一个默认。切换至其他类型自动隐藏并重置为关闭 |
| 设为默认收入账户 | ⭕ | 开关 | **仅现金类/负债类可用**。开启后记账时默认选中此账户，同一类型最多一个默认。切换至其他类型自动隐藏并重置为关闭 |
| 账户说明 | ⭕ | 0-500字符 | 多行文本输入，右下角显示字符计数 `n/500` |

### 账户类型
固定5种账户类型：

| 类型标识 | 中文名称 | 说明 | 余额颜色 |
|---------|---------|------|---------|
| cash | 现金类 | 现金、银行卡、支付宝、微信等 | var(--color-success, #10B981) |
| investment | 投资类 | 股票、基金、债券等 | var(--color-success, #10B981) |
| fixed_asset | 固定资产类 | 房产、车位、商铺等 | var(--color-success, #10B981) |
| depreciable_asset | 折旧资产类 | 手机、电脑、家电等 | var(--color-success, #10B981) |
| liability | 负债类 | 信用卡、贷款、花呗等 | var(--color-danger, #EF4444) |

### 预设图标列表
```
             
```
共14个预设图标，80×80 卡片式 `flex-wrap` 布局展示。顶部有 112×112 大预览区实时预览当前选中图标。选中项浅蓝底色（`rgba(0,191,255,0.1)`）高亮。

### 交互细节

- **默认值填充**：新增模式图标默认，类型默认cash（现金类），余额输入框为空，默认开关均关闭
- **默认开关显示规则**：只有现金类和负债类显示「设为默认支出/收入账户」开关，投资类、固定资产类、折旧资产类不显示该选项
- **类型切换自动重置**：切换到非现金类/非负债类时，自动将默认支出/收入标记重置为关闭
- **保存按钮**：使用 WdButton 组件，固定在页面底部，`disabled` 置灰不可点击，`loading` 显示加载中状态
- **保存反馈**：调用API成功后toast提示"创建成功"/"修改成功"，1.5秒后自动 `navigateBack` 返回列表页
- **余额输入**：使用 WdInput 组件，`prefix` 插槽显示¥符号，输入时实时正则校验
  - 非负债类：只允许数字和最多2位小数，不允许负数
  - 负债类：允许数字、小数和负号，自动将输入的正数转为负数
- **占位符**：根据账户类型动态显示，负债类显示"-0.00"，其他显示"0.00"
- **类型切换自动转换**：
  - 从非负债类切换到负债类：如果余额是正数，自动加负号转为负数
  - 从负债类切换到非负债类：如果余额是负数，自动去掉负号转为正数
- **默认账户开关互斥逻辑**：
  - 仅现金类和负债类账户支持设为默认，其他类型后端强制忽略
  - 开启「设为默认支出账户」时，后端自动将同类型（现金类/负债类）其他账户的该字段设为false
  - 开启「设为默认收入账户」时，后端自动将同类型（现金类/负债类）其他账户的该字段设为false
- **字符计数**：WdTextarea 组件 `showWordCount` 属性自动显示 `当前字符数/500`
- **清除按钮**：WdInput 组件 `showClear` 属性提供一键清除功能

### 记账页使用规则

- **仅现金类和负债类**支持设为默认支出/收入账户（投资、固定、折旧资产不参与记账账户自动选中）
- 新增记账记录时，根据收支类型自动选择对应类型的默认账户
- 支出场景：优先选择 `isDefaultExpense = true` 的账户
- 收入场景：优先选择 `isDefaultIncome = true` 的账户
- 若用户手动切换过账户，下次进入时优先记住用户上次选择的账户
- 若无默认账户，则选择该类型排序（order字段）最靠前的账户

## UI 组件使用

页面使用 WotUI (`@wot-ui/ui`) 组件库，通过 `@uni-helper/vite-plugin-uni-components` 自动按需导入。

| 组件 | 用途 | 关键属性 |
|------|------|---------|
| WdNavbar | 顶部导航栏 | `title`, `leftArrow`, `fixed`, `placeholder`, `bordered`, `safeAreaInsetTop` |
| WdInput | 账户名称输入 | `v-model`, `placeholder`, `maxlength=20`, `showClear` |
| WdInput | 账户余额输入 | `:model-value` + `@update:model-value`, `type="text"`, `:placeholder` 动态占位符, `showClear`, `prefix` 插槽放¥ |
| WdSwitch | 默认支出账户开关 | `v-model="isDefaultExpense"`, `activeColor="var(--color-primary, #0D9488)"` |
| WdSwitch | 默认收入账户开关 | `v-model="isDefaultIncome"`, `activeColor="var(--color-primary, #0D9488)"` |
| WdTextarea | 账户说明输入 | `v-model`, `placeholder`, `maxlength=500`, `showWordCount`, `autoHeight` |
| WdButton | 保存按钮 | `type="primary"`, `block`, `:disabled`, `:loading` |

> **注意**：图标选择器和类型选择器保持自定义实现（卡片式交互），WotUI 无直接对应的卡片选择组件，彩色圆点+emoji 方案比 WdRadio/WdCheckbox 更符合记账 App 视觉调性。

## UI 设计规范

### 布局（v2.1 升级版）
- 页面背景：`var(--color-bg-page)`（与全局一致）
- 页面内边距：`16rpx`
- 内容卡片：`var(--color-bg-card)` 背景，圆角 `24rpx`，内边距 `32rpx 28rpx`，卡片间距 `20rpx`
- 导航栏：WdNavbar 组件，`fixed` + `placeholder` 固定顶部
- 表单输入区背景：`var(--color-bg-card)`（替代旧版灰色）
- 表单行间距：`32rpx`
- 标签文字：`26rpx` `var(--color-text-secondary)` `font-weight: 500`，下间距 `12rpx`

### 图标选择区（卡片分区）
- **大预览区**：112rpx × 112rpx，圆角 `24rpx`，背景 `var(--color-primary-light, #E6F7F5)`
  - 负债类时背景自动切换为 `var(--color-danger-light, #FEF2F2)`
- **预览右侧**：双行说明文字（"选择图标" 30rpx 加粗 + "点击下方图标更换" 24rpx 灰色）
- **小图标行**：每个 80rpx × 80rpx，圆角 `16rpx`，间距 `12rpx`，`flex-wrap`
  - 默认：`var(--color-bg-card)` 背景
  - 选中：`var(--color-primary-light, #E6F7F5)` 背景
  - 点击反馈：`scale(0.92)`

### 类型选择区（卡片分区）
- **卡片布局**：5 种类型分两行（上3 + 下2），每列 `flex: 1`，高度 `112rpx`，间距 `16rpx`
- **默认态**：`#F5F6FA` 背景，圆角 `16rpx`
- **选中态**：底色改为类型对应淡色（`activeBg`），标签文字变类型主色加粗
- **每卡片**：彩色圆点(8rpx) + emoji(32rpx) + 标签(22rpx)，垂直排列居中
- **类型色值配置**：

| 类型 | 主色 | emoji | 选中背景 |
|------|------|-------|---------|
| 现金类 | `#00BFFF` |  | `rgba(0,191,255,0.06)` |
| 投资类 | `#FF9800` |  | `rgba(255,152,0,0.06)` |
| 固定资产类 | `#9C27B0` |  | `rgba(156,39,176,0.06)` |
| 折旧资产类 | `#00BCD4` |  | `rgba(0,188,212,0.06)` |
| 负债类 | `#FA3534` |  | `rgba(250,53,52,0.06)` |

### 余额输入区
- 外层容器：`var(--color-bg-card)` 背景，圆角 `10rpx`，高 `88rpx`，padding `0 24rpx`
- ¥ 前缀：`32rpx` `var(--color-text-primary)` `font-weight: 700`
- `1rpx × 36rpx` 竖线分隔符（`var(--color-border)`），左右间距 `20rpx`
- WdInput：透明背景，无边线，`flex: 1`

### 开关区（独立卡片）
- 卡片无边距（`padding: 0`），内部行 `padding: 28rpx`
- 分割线：`1rpx` `var(--color-border-light)`，左右留 `28rpx`
- 双行说明：标题 `28rpx` `var(--color-text-primary)` + 说明 `22rpx` `var(--color-text-secondary)`，间距 `6rpx`

### 保存按钮
- WdButton `block`，高度 `96rpx`，圆角 `12rpx`
- 固定在页面底部，`padding: 20rpx 32rpx` + 安全区
- 底部背景 `var(--color-bg-page)`

### 交互状态
- 所有卡片内元素点击反馈：`scale(0.92~0.96)` + `transition 150ms ease`
- WdSwitch `activeColor="var(--color-primary, #0D9488)"`
- 表单输入区统一 `var(--color-bg-card)` 底色

## 数据结构

### 账户类型定义（`src/types/account.ts`）

```typescript
// 账户类型枚举
export type AccountType = 'cash' | 'investment' | 'fixed_asset' | 'depreciable_asset' | 'liability';

// 账户数据结构
export interface Account {
  id: string;
  userId: string;
  name: string;
  icon: string;
  type: AccountType;
  balance: number;
  description?: string;
  isDefaultExpense: boolean;     // 是否为默认支出账户
  isDefaultIncome: boolean;      // 是否为默认收入账户
  order: number;
  isVisible: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// 创建/编辑账户的请求参数
export interface AccountRequest {
  name: string;
  icon: string;
  type: AccountType;
  balance: number;
  description?: string;
  isDefaultExpense: boolean;
  isDefaultIncome: boolean;
}

// 账户类型选项
export const ACCOUNT_TYPE_OPTIONS = [
  { value: 'cash' as AccountType, label: '现金类' },
  { value: 'investment' as AccountType, label: '投资类' },
  { value: 'fixed_asset' as AccountType, label: '固定资产类' },
  { value: 'depreciable_asset' as AccountType, label: '折旧资产类' },
  { value: 'liability' as AccountType, label: '负债类' }
]

// 预设图标
export const ACCOUNT_ICONS = [
  '', '', '', '', '', '', '', '', '', '', '', '', '', ''
]

// 获取账户类型的余额颜色
export const getBalanceColor = (type: AccountType): string => {
  if (type === 'liability') {
    return '#FA3534'
  }
  return '#19BE6B'
}

// 默认账户配置
const DEFAULT_ACCOUNTS: Omit<Account, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: '现金',
    icon: '',
    type: 'cash',
    balance: 0,
    description: '日常现金备用',
    order: 1,
    isDefaultExpense: true,    // 现金默认作为支出账户
    isDefaultIncome: true,     // 现金默认作为收入账户
    isVisible: true,
    isDeleted: false
  },
  {
    name: '折旧资产',
    icon: '',
    type: 'depreciable_asset',
    balance: 0,
    description: '手机、电脑等折旧物品',
    order: 2,
    isDefaultExpense: false,
    isDefaultIncome: false,
    isVisible: true,
    isDeleted: false
  },
  {
    name: '固定资产',
    icon: '',
    type: 'fixed_asset',
    balance: 0,
    description: '房产、车位等高价值物品',
    order: 3,
    isDefaultExpense: false,
    isDefaultIncome: false,
    isVisible: true,
    isDeleted: false
  }
]
```

## API 接口（`src/api/account.ts`）

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| getAccountDetail | GET | `/api/accounts/:id` | 获取账户详情（编辑模式加载数据） |
| createAccount | POST | `/api/accounts` | 创建新账户 |
| updateAccount | PUT | `/api/accounts/:id` | 更新账户信息 |

### 请求/响应格式

```typescript
// 创建/更新请求体（AccountRequest）
{
  name: string;             // 账户名称
  icon: string;             // 图标emoji
  type: AccountType;        // 账户类型
  balance: number;          // 账户余额
  description?: string;     // 账户说明
  isDefaultExpense: boolean;// 是否默认支出账户
  isDefaultIncome: boolean; // 是否默认收入账户
}

// 响应体
{
  success: boolean;
  message: string;
  data: Account;
}
```

## 页面逻辑流程

### 新增模式
1. 进入页面（无 `id` 参数）
2. 初始化表单：图标=，类型=cash，余额输入框为空
3. 用户填写表单
4. `canSave` 计算属性校验：名称非空 && 名称≤20字符 && 余额为有效数字
5. 点击保存 → `saving = true` → 调用 `createAccount` API
6. API 成功 → 若 `balance !== 0`，调用 `createRecord` 生成调整记录（差额 = balance）
7. 成功 → toast "创建成功" → 1.5s后 `navigateBack`
8. 失败 → toast 显示错误信息 → `saving = false`

### 编辑模式
1. 进入页面（带 `id` 参数）
2. `onLoad` 中调用 `loadAccountDetail(id)` 加载账户详情，记录 `oldBalance`
3. 将返回数据填充到 `formData` 和 `balanceInput`
4. 用户修改表单
5. 点击保存 → `saving = true` → 调用 `updateAccount(id, formData)` API
6. API 成功 → 计算 `diff = newBalance - oldBalance`，若 `diff !== 0`，调用 `createRecord` 生成调整记录
7. 成功 → toast "修改成功" → 1.5s后 `navigateBack`
8. 失败 → toast 显示错误信息 → `saving = false`

### 保存按钮可用条件
```typescript
const saving = ref(false);

const canSave = computed(() => {
  return formData.value.name.trim().length > 0 &&
         formData.value.name.length <= 20 &&
         !isNaN(formData.value.balance);
});

// WdButton 绑定：:disabled="!canSave" :loading="saving"
```

### 余额输入校验
```typescript
const onTypeChange = (type: string) => {
  const oldType = formData.value.type;
  formData.value.type = type;
  
  // 如果从非负债类切换到负债类，且当前余额是正数，自动转为负数
  if (type === 'liability' && oldType !== 'liability') {
    if (balanceInput.value !== '' && !balanceInput.value.startsWith('-')) {
      const num = parseFloat(balanceInput.value) || 0;
      if (num > 0) {
        balanceInput.value = '-' + balanceInput.value;
        formData.value.balance = -num;
      }
    }
  }
  // 如果从负债类切换到非负债类，且当前余额是负数，自动转为正数
  else if (type !== 'liability' && oldType === 'liability') {
    if (balanceInput.value.startsWith('-')) {
      const num = parseFloat(balanceInput.value) || 0;
      balanceInput.value = balanceInput.value.slice(1);
      formData.value.balance = Math.abs(num);
    }
  }
};

const onBalanceInput = (value: string) => {
  const isLiability = formData.value.type === 'liability';
  
  // 负债类允许负数，其他类不允许负数
  let regex;
  if (isLiability) {
    regex = /^-?\d*\.?\d{0,2}$/;
  } else {
    regex = /^\d*\.?\d{0,2}$/;
  }
  
  if (regex.test(value) || value === '') {
    balanceInput.value = value;
    
    if (value !== '') {
      const num = parseFloat(value) || 0;
      // 负债类强制为负数（如果输入正数自动转为负数）
      if (isLiability && num > 0) {
        balanceInput.value = '-' + value;
        formData.value.balance = -num;
      } else {
        formData.value.balance = num;
      }
    } else {
      formData.value.balance = 0;
    }
  }
};
```

## 边界情况

1. **网络错误**：catch 捕获后 toast "网络错误"，`saving = false`
2. **账户不存在**：API 返回 success=false，toast 显示 message
3. **余额输入非法字符**：正则过滤
   - 非负债类：只允许数字和最多2位小数
   - 负债类：允许数字、小数和负号，最多2位小数
4. **负债类自动转负**：在负债类输入正数时，自动转为负数
5. **类型切换自动转换**：
   - 非负债类→负债类：正数自动转负数
   - 负债类→非负债类：负数自动转正数
6. **空名称提交**：canSave 为 false，WdButton `disabled` 置灰不可点击
7. **名称超长**：WdInput `maxlength=20` 自动限制，canSave 为 false
8. **编辑模式加载失败**：toast 提示错误信息，用户可手动返回
9. **重复提交防护**：`saving` 状态为 true 时 `handleSave` 直接 return，防止重复提交
10. **调整记录创建失败**：账户保存成功但调整记录创建失败时，toast 提示"账户已保存，但调整记录生成失败"，仍正常 navigateBack，避免阻塞用户操作
11. **差额为0不生成记录**：新增账户余额为0、编辑账户余额未变更时，跳过调整记录创建
12. **类型切换不触发调整**：只有点击保存时才计算差额并生成调整记录，页面内切换类型导致的余额符号自动转换不产生记录