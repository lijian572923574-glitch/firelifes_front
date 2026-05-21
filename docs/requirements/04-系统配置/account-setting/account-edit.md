# 账户编辑页
> 文件：`account-edit.md` | 中文名称：账户编辑 | 所属模块：系统配置（我的页面子模块）
> 页面路径：`pages/my/account-setting/account-edit.vue`

> 版本：v1.9 | 状态：✅已实现 | 最后更新：2026-05-21

## 版本历史
| 版本 | 日期 | 变更内容 | 作者 |
|------|------|---------|------|
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

## 功能概述
账户编辑页支持新增账户和编辑两种模式，提供账户信息的基本维护功能。

## 用户故事
作为用户，我希望能灵活添加和修改账户信息，这样我可以准确记录每个账户的财务状况。

## 交互设计

### 页面结构

```
账户编辑页
┌────────────────────────────────────┐
│  ← 新增账户 / 编辑账户  (WdNavbar) │
├────────────────────────────────────┤
│  账户图标                            │
│  ┌────────────────────────────────┐ │
│  │ [💵] [🏦] [💚] [📈] [🏠] [🚗]  │ │
│  │ [💳] [📱] [💻] [🎮] [📷] [🎵]  │ │
│  │ [📚] [🎁]                      │ │
│  └────────────────────────────────┘ │
│                                      │
│  账户名称                     (WdInput)│
│  ┌────────────────────────────────┐ │
│  │ 请输入账户名称              [x] │ │
│  └────────────────────────────────┘ │
│                                      │
│  账户类型                            │
│  ┌────────────────────────────────┐ │
│  │ [现金类] [投资类] [固定资产类]    │ │
│  │ [折旧资产类] [负债类]            │ │
│  └────────────────────────────────┘ │
│                                      │
│  账户余额                     (WdInput)│
│  ┌────────────────────────────────┐ │
│  │ ¥ 0.00                     [x] │ │
│  └────────────────────────────────┘ │
│                                      │
│  设为默认支出账户        (WdSwitch)  │
│  ┌────────────────────────────────┐ │
│  │ [ ] 记账时默认选中用于支出      │ │
│  └────────────────────────────────┘ │
│                                      │
│  设为默认收入账户        (WdSwitch)  │
│  ┌────────────────────────────────┐ │
│  │ [ ] 记账时默认选中用于收入      │ │
│  └────────────────────────────────┘ │
│                                      │
│  账户说明                 (WdTextarea)│
│  ┌────────────────────────────────┐ │
│  │ 请输入账户说明（选填）          │ │
│  │                         0/500  │ │
│  └────────────────────────────────┘ │
│                                      │
├────────────────────────────────────┤
│       [ 保 存 ]  (WdButton)         │
└────────────────────────────────────┘
```

### 页面模式

- **新增模式**：标题显示"新增账户"，所有字段为空，图标默认选中💵，类型默认现金类，保存后创建新账户
- **编辑模式**：标题显示"编辑账户"，通过路由参数 `id` 加载已有账户数据并填充表单，保存后更新

### 表单字段与验证

| 字段 | 必填 | 验证规则 | 说明 |
|------|------|---------|------|
| 账户图标 | ⭕ | 14个预设图标选一 | 新增模式默认💵，编辑模式加载已有图标 |
| 账户名称 | ✅ | 1-20字符 | 非空且不超过20字符 |
| 账户类型 | ✅ | 五选一 | 现金类 / 投资类 / 固定资产类 / 折旧资产类 / 负债类，pill标签样式 |
| 账户余额 | ✅ | 数字，最多2位小数 | ¥前缀，输入时正则校验 `/^\d*\.?\d{0,2}$/`，负债类传负数 |
| 设为默认支出账户 | ⭕ | 开关 | **仅现金类/负债类可用**。开启后记账时默认选中此账户，同一类型最多一个默认。切换至其他类型自动隐藏并重置为关闭 |
| 设为默认收入账户 | ⭕ | 开关 | **仅现金类/负债类可用**。开启后记账时默认选中此账户，同一类型最多一个默认。切换至其他类型自动隐藏并重置为关闭 |
| 账户说明 | ⭕ | 0-500字符 | 多行文本输入，右下角显示字符计数 `n/500` |

### 账户类型
固定5种账户类型：

| 类型标识 | 中文名称 | 说明 | 余额颜色 |
|---------|---------|------|---------|
| cash | 现金类 | 现金、银行卡、支付宝、微信等 | 绿色 #19BE6B |
| investment | 投资类 | 股票、基金、债券等 | 绿色 #19BE6B |
| fixed_asset | 固定资产类 | 房产、车位、商铺等 | 绿色 #19BE6B |
| depreciable_asset | 折旧资产类 | 手机、电脑、家电等 | 绿色 #19BE6B |
| liability | 负债类 | 信用卡、贷款、花呗等 | 红色 #FA3534 |

### 预设图标列表
```
💵 🏦 💚 📈 🏠 🚗 💳 📱 💻 🎮 📷 🎵 📚 🎁
```
共14个预设图标，网格布局展示，选中项蓝色边框高亮。

### 交互细节

- **默认值填充**：新增模式图标默认💵，类型默认cash（现金类），余额输入框为空，默认开关均关闭
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
| WdSwitch | 默认支出账户开关 | `v-model="isDefaultExpense"`, `activeColor="#00BFFF"` |
| WdSwitch | 默认收入账户开关 | `v-model="isDefaultIncome"`, `activeColor="#00BFFF"` |
| WdTextarea | 账户说明输入 | `v-model`, `placeholder`, `maxlength=500`, `showWordCount`, `autoHeight` |
| WdButton | 保存按钮 | `type="primary"`, `block`, `:disabled`, `:loading` |

> **注意**：图标选择器和类型选择器保持自定义实现，WotUI 无直接对应的 emoji 选择器组件，pill 标签样式比 WdRadio 更符合设计需求。

## UI 设计规范

### 布局
- 页面背景：#F5F5F5
- 导航栏：WdNavbar 组件，`fixed` + `placeholder` 固定顶部
- 表单容器：白色背景，margin 0 24rpx，圆角 16rpx，内边距 32rpx 24rpx
- 表单项间距：40rpx
- 标签与输入框间距：16rpx
- 图标项尺寸：96rpx × 96rpx，间距 16rpx
- 类型标签：padding 12rpx 24rpx，圆角 40rpx，间距 12rpx
- 保存按钮：WdButton `block` 通栏，高度 88rpx，圆角 44rpx，固定在底部

### 颜色
- 页面背景：#F5F5F5
- 表单容器背景：#FFFFFF
- 输入框背景：#F8F8F8（通过 WdInput/WdTextarea `customStyle` 设置）
- 选中边框：#00BFFF
- 选中背景：rgba(0, 191, 255, 0.1)
- 标签文字：#333333
- 占位文字：#CCCCCC
- 保存按钮：WdButton `type="primary"` 默认主题色
- 禁用态：WdButton `disabled` 属性自动处理

### 字体
- 导航标题：WdNavbar 默认样式
- 表单标签：28rpx，font-weight 500，#333333
- 输入文字：WdInput/WdTextarea 默认样式
- 图标文字：48rpx
- 类型标签文字：26rpx，#333333（选中态 #00BFFF，font-weight 500）
- 货币符号¥：32rpx，font-weight 600，#333333
- 保存按钮：WdButton 默认样式，`customStyle` 设置 32rpx font-weight 600

### 交互状态
- 图标项默认：背景 #F8F8F8，无边框
- 图标项选中：边框 2rpx #00BFFF，背景 rgba(0, 191, 255, 0.1)
- 类型标签默认：背景 #F8F8F8，无边框
- 类型标签选中：边框 2rpx #00BFFF，背景 rgba(0, 191, 255, 0.1)，文字 #00BFFF
- 输入框清除：WdInput `showClear` 聚焦/有内容时显示清除按钮
- 保存按钮正常：WdButton `type="primary"` 正常态
- 保存按钮禁用：WdButton `disabled` 自动置灰
- 保存按钮加载：WdButton `loading` 显示加载动画

### 动效
- 图标/类型选中切换：transition all 0.2s ease
- 保存按钮状态切换：transition opacity 0.2s ease

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
  '💵', '🏦', '💚', '📈', '🏠', '🚗', '💳', '📱', '💻', '🎮', '📷', '🎵', '📚', '🎁'
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
    icon: '💵',
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
    icon: '📱',
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
    icon: '🏠',
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
2. 初始化表单：图标=💵，类型=cash，余额输入框为空
3. 用户填写表单
4. `canSave` 计算属性校验：名称非空 && 名称≤20字符 && 余额为有效数字
5. 点击保存 → `saving = true` → 调用 `createAccount` API
6. 成功 → toast "创建成功" → 1.5s后 `navigateBack`
7. 失败 → toast 显示错误信息 → `saving = false`

### 编辑模式
1. 进入页面（带 `id` 参数）
2. `onLoad` 中调用 `loadAccountDetail(id)` 加载账户详情
3. 将返回数据填充到 `formData` 和 `balanceInput`
4. 用户修改表单
5. 点击保存 → `saving = true` → 调用 `updateAccount(id, formData)` API
6. 成功 → toast "修改成功" → 1.5s后 `navigateBack`
7. 失败 → toast 显示错误信息 → `saving = false`

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