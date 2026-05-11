
# 账户列表页
&gt; 文件：`account-list.md` | 中文名称：账户管理列表页 | 所属模块：系统配置（我的页面子模块）
&gt; 页面路径：`pages/my/account-setting/account-list.vue`

&gt; 版本：v2.0 | 状态：🟡设计中 | 最后更新：2026-05-12

## 版本历史
| 版本 | 日期 | 变更内容 | 作者 |
|------|------|---------|------|
| v2.0 | 2026-05-12 | 统一使用WotUI组件库，左滑交互模式 | AI |
| v1.3 | 2026-05-09 | 固定账户类型为5种：现金类、投资类、固定资产类、折旧资产类、负债类 | AI |
| v1.2 | 2026-05-09 | 添加默认账户：现金、折旧资产、固定资产 | AI |
| v1.1 | 2026-05-09 | 简化字段：只保留名称、类型、余额、说明、图标 | AI |
| v1.0 | 2026-05-09 | 从 account-system.md 拆分，账户列表页独立需求 | AI |

---

## 功能概述
账户列表是账户体系的入口页面，展示所有账户，支持新增、编辑账户。新用户注册后自动创建3个默认账户。

## 用户故事
作为新用户，我希望注册后已有一些默认账户，这样我可以直接开始记账，不用手动创建。

---

## 交互设计

### 页面结构

```
账户列表页
┌────────────────────────────────────┐
│  ← 返回     我的账户       [+]     │ ← WdNavbar
├────────────────────────────────────┤
│  ┌──────────────────────────────┐  │
│  │ 💵 现金              ¥3,210.00 │  │ ← WdSwipeCell 左滑区域
│  │     日常现金备用                │  │
│  └──────────────────────────────┘  │
│  ┌──────┐  ┌──────┐              │
│  │ 编辑 │  │ 删除 │              │ ← WdSwipeCell 右滑操作区
│  └──────┘  └──────┘              │    (默认账户只显示编辑)
│                                     │
│  ┌──────────────────────────────┐  │
│  │ 📱 折旧资产         ¥5,000.00 │  │
│  │     手机、电脑等折旧物品        │  │
│  └──────────────────────────────┘  │
│  ┌──────┐                         │
│  │ 编辑 │                         │
│  └──────┘                         │
│                                     │
│  ...                                │
│                                     │
└────────────────────────────────────┘
```

### 默认账户

用户注册成功后，系统自动创建以下3个默认账户：

| 账户名称 | 图标 | 类型 | 余额 | 说明 | 排序 |
|---------|------|------|------|------|------|
| 现金 | 💵 | 现金类 | 0 | 日常现金备用 | 1 |
| 折旧资产 | 📱 | 折旧资产类 | 0 | 手机、电脑等折旧物品 | 2 |
| 固定资产 | 🏠 | 固定资产类 | 0 | 房产、车位等高价值物品 | 3 |

**注意**：默认账户不可删除，但可以编辑名称、余额和说明。

### 账户卡片展示
每个账户卡片使用 `WdSwipeCell` 组件：
- **图标**：左侧显示账户图标（emoji）
- **名称**：账户名称（加粗）
- **说明**：账户说明（可选，灰色小字）
- **余额**：右侧显示余额（资产绿色，负债红色）
- **左滑操作区**：
  - 默认账户：仅显示编辑按钮（主色）
  - 非默认账户：显示编辑按钮（主色）+ 删除按钮（危险色）

### 卡片交互
- **点击卡片**：进入账户编辑页
- **向左滑动卡片**：显示操作按钮
- **点击编辑按钮**：进入账户编辑页（阻止冒泡）
- **点击删除按钮**：显示确认弹窗（仅非默认账户，阻止冒泡）

### 账户类型
固定5种账户类型：

| 类型标识 | 中文名称 | 说明 | 余额颜色 |
|---------|---------|------|---------|
| cash | 现金类 | 现金、银行卡、支付宝、微信等 | 绿色 |
| investment | 投资类 | 股票、基金、债券等 | 绿色 |
| fixed_asset | 固定资产类 | 房产、车位、商铺等 | 绿色 |
| depreciable_asset | 折旧资产类 | 手机、电脑、家电等 | 绿色 |
| liability | 负债类 | 信用卡、贷款、花呗等 | 红色 |

### 交互流程

1. **页面加载**
   - 显示所有账户列表（包括默认账户）
   - 无账户时显示空状态

2. **右上角"+"按钮**
   - 点击跳转到账户编辑页（新增模式）

3. **账户卡片点击**
   - 点击任意账户卡片，跳转到账户编辑页（编辑模式）

4. **左滑卡片 → 编辑按钮**
   - 点击跳转到账户编辑页（编辑模式）

5. **左滑卡片 → 删除按钮**
   - 点击显示确认弹窗："确定要删除此账户吗？"
   - 确认后删除并刷新列表
   - 默认账户不显示删除按钮

### 状态变化

| 状态 | 触发条件 | 行为 |
|------|----------|------|
| 空态 | 无账户 | 显示引导卡片"添加你的第一个账户" |
| 正常 | 有账户 | 显示账户列表 |
| 加载中 | 请求数据中 | 显示加载文字 |
| 删除确认 | 点击删除 | 显示确认弹窗 |
| 删除完成 | 确认删除 | 删除并刷新列表 |

---

## UI 组件使用

页面使用 WotUI (`@wot-ui/ui`) 组件库，通过 `@uni-helper/vite-plugin-uni-components` 自动按需导入。

| 组件 | 用途 | 关键属性 |
|------|------|---------|
| WdNavbar | 顶部导航栏 | `title="我的账户"`, `leftArrow`, `fixed`, `placeholder`, `bordered`, `safeAreaInsetTop`, `rightText="+", @click-right` |
| WdSwipeCell | 左滑单元格 | `:right-width="140"`, `#default`, `#right` |
| WdButton | 操作按钮 | `size="small"`, `type="primary"` (编辑), `type="danger"` (删除) |
| WdDialog | 删除确认弹窗 | `v-model`, `title`, `show-cancel-button`, `show-confirm-button` |

&gt; **注意**：页面容器需设置 `overflow-x: hidden` 禁止横向滚动，避免与 WdSwipeCell 冲突。

---

## UI 设计规范

### 布局
- 页面背景：#F5F5F5
- 导航栏：WdNavbar 组件，`fixed` + `placeholder` 固定顶部
- 账户卡片：高度 120rpx，圆角 16rpx
- 卡片间距：16rpx
- 图标尺寸：64rpx
- WdSwipeCell 右滑区域宽度：140rpx（编辑70rpx + 删除70rpx，默认账户70rpx）

### 颜色（卡布里蓝体系）
- 页面背景：#F5F5F5
- 卡片背景：#FFFFFF
- 现金类/投资类/固定资产类/折旧资产类余额：#19BE6B（绿色）
- 负债类余额：#FA3534（红色）
- 新增按钮：#00BFFF
- 编辑按钮：#00BFFF（WdButton type="primary"）
- 删除按钮：#FA3534（WdButton type="danger"）
- 说明文字：#999999
- 分割线：#F5F5F5

### 字体
- 导航标题：WdNavbar 默认样式
- 账户名称：32rpx，#333333，加粗
- 账户说明：26rpx，#999999
- 余额：36rpx，资产 #19BE6B，负债 #FA3534
- 操作按钮文字：26rpx，WdButton 默认样式

### 动效
- 列表加载：fadeIn，时长 300ms，stagger 50ms
- WdSwipeCell 滑动：组件自带过渡动画
- WdButton 点击：组件自带反馈效果

---

## 数据结构

### 账户数据结构
```typescript
// 账户类型枚举
type AccountType = 'cash' | 'investment' | 'fixed_asset' | 'depreciable_asset' | 'liability';

interface Account {
  id: string;                      // UUID
  userId: string;                  // 用户ID
  name: string;                    // 账户名称
  icon: string;                    // 图标（emoji）
  type: AccountType;               // 账户类型
  balance: number;                 // 余额
  description?: string;            // 说明（可选）
  isDefault?: boolean;             // 是否为默认账户
  // 通用字段
  order: number;                   // 排序
  isVisible: boolean;              // 是否显示
  isDeleted: boolean;              // 软删除标记
  createdAt: string;
  updatedAt: string;
}

// 默认账户配置
const DEFAULT_ACCOUNTS: Omit&lt;Account, 'id' | 'userId' | 'createdAt' | 'updatedAt'&gt;[] = [
  {
    name: '现金',
    icon: '💵',
    type: 'cash',
    balance: 0,
    description: '日常现金备用',
    order: 1,
    isDefault: true,
    isVisible: true,
    isDeleted: false
  },
  {
    name: '折旧资产',
    icon: '📱',
    type: 'depreciable_asset',
    balance: 0,
    description: '手机、电脑等折旧物品',
    order: 2,
    isDefault: true,
    isVisible: true,
    isDeleted: false
  },
  {
    name: '固定资产',
    icon: '🏠',
    type: 'fixed_asset',
    balance: 0,
    description: '房产、车位等高价值物品',
    order: 3,
    isDefault: true,
    isVisible: true,
    isDeleted: false
  }
];
```

---

## API 接口

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| getAccountList | GET | `/api/accounts` | 获取账户列表 |
| deleteAccount | DELETE | `/api/accounts/:id` | 删除账户 |

### 请求/响应格式
```typescript
// 响应体
{
  success: boolean;
  message: string;
  data: Account[];
}
```

---

## 边界情况

1. **未登录状态**
   - 不显示账户列表
   - 提示登录

2. **网络错误**
   - 提示："网络错误，请重试"

3. **空状态**
   - 显示引导卡片"添加你的第一个账户"

4. **删除默认账户**
   - 默认账户不显示删除按钮
   - 只有非默认账户可以删除

5. **禁止横向滚动**
   - 页面根容器设置 `overflow-x: hidden`
   - 避免与 WdSwipeCell 的横向滑动冲突

---

## 实现要点

### WdSwipeCell 使用示例
```vue
&lt;wd-swipe-cell :right-width="account.isDefault ? 70 : 140"&gt;
  &lt;template #default&gt;
    &lt;view class="account-card" @click="goToEdit(account.id)"&gt;
      &lt;view class="card-left"&gt;
        &lt;text class="account-icon"&gt;{{ account.icon }}&lt;/text&gt;
        &lt;view class="account-info"&gt;
          &lt;text class="account-name"&gt;{{ account.name }}&lt;/text&gt;
          &lt;text v-if="account.description" class="account-desc"&gt;{{ account.description }}&lt;/text&gt;
        &lt;/view&gt;
      &lt;/view&gt;
      &lt;text class="account-balance" :class="{ 'is-liability': account.type === 'liability' }"&gt;
        ¥{{ account.balance.toFixed(2) }}
      &lt;/text&gt;
    &lt;/view&gt;
  &lt;/template&gt;
  &lt;template #right&gt;
    &lt;wd-button size="small" type="primary" @click.stop="goToEdit(account.id)"&gt;编辑&lt;/wd-button&gt;
    &lt;wd-button v-if="!account.isDefault" size="small" type="danger" @click.stop="handleDelete(account)"&gt;删除&lt;/wd-button&gt;
  &lt;/template&gt;
&lt;/wd-swipe-cell&gt;
```

### 禁止横向滚动
```vue
&lt;style scoped&gt;
.page-container {
  overflow-x: hidden; /* 关键：禁止页面横向滚动 */
  min-height: 100vh;
  background-color: #F5F5F5;
}
&lt;/style&gt;
```

