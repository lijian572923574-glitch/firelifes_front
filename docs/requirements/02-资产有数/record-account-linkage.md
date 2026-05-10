# 记账账户联动
&gt; 文件：record-account-linkage.md | 中文名称：记账自动更新账户余额与折旧资产生成功能 | 所属模块：资产有数
&gt; 版本：v1.0 | 状态：🟡设计中 | 最后更新：2026-05-09

## 版本历史
| 版本 | 日期 | 变更内容 | 作者 |
|------|------|---------|------|
| v1.0 | 2026-05-09 | 初始版本 | AI |

---

> 最后更新：2026-05-09

---

## 功能概述
记账时选择账户后，该笔记账金额自动更新账户余额。支出减少余额，收入增加余额，转账在转出账户减少、转入账户增加。编辑或删除记账记录时，同步回滚或重算账户余额。同时支持将支出记入折旧资产，自动创建折旧资产记录。

## 用户故事
作为用户，我希望记账后自动看到各账户的余额变化，而不需要手动更新，这样我可以随时掌握每个账户的实时余额，并且确保账户余额与实际一致。我还希望在记支出时可以将大件消费（如手机、相机）记入折旧资产，追踪其价值损耗。

## 交互设计

### 页面结构

```
记账页 Header (src/pages/record/index.vue)
┌────────────────────────────────────┐
│  [时间选择器]  [账户选择器 ▼]        │
│   2024-05-09   储蓄卡          >   │
└────────────────────────────────────┘

记账页 - 支出类型 (src/pages/record/index.vue)
┌────────────────────────────────────┐
│  [时间选择器]  [账户选择器 ▼]        │
│   2024-05-09   储蓄卡          >   │
├────────────────────────────────────┤
│                                      │
│  支出                               │
│  ┌────────────────────────────────┐ │
│  │         ¥ 500.00               │ │
│  └────────────────────────────────┘ │
│                                      │
│  📁 鞋服 > 鞋子                      │
│                                      │
│  ┌─ 记入资产 ─────────────────────┐ │
│  │ [  开关  ]                    │ │
│  └────────────────────────────────┘ │
│  │ ▼ 展开区域（开关打开后显示）    │ │
│  │ 品类标签：[鞋服 ▼]             │ │
│  │ 折旧方法：[直线法 ▼]           │ │
│  │   └─ 每月固定折旧 ¥18.75      │ │
│  │ 计划使用时长：[24] 个月        │ │
│  │ 预期残值：¥ [50]               │ │
│  │ 资产名称：[鞋子]               │ │
│  └────────────────────────────────┘ │
│                                      │
│  [ 记 账 ]                          │
└────────────────────────────────────┘

记账确认卡片 (record-confirm-card)
┌────────────────────────────────────┐
│            ✓ 记账成功               │
│                                      │
│          -¥200.00                    │
│          星巴克咖啡                  │
│                                      │
│   💵 储蓄卡    📁 餐饮 > 咖啡      │
│                                      │
│   这笔消费 ≈ 2.5 天 FIRE时间       │
│   [继续记]        [返回明细]        │
└────────────────────────────────────┘

处置后自动生成收入记录 (卖出折旧资产)
┌────────────────────────────────────┐
│  ← 记账                    [保存]  │
├────────────────────────────────────┤
│                                      │
│  收入                               │
│  ┌────────────────────────────────┐ │
│  │         ¥ 3,500.00             │ │
│  └────────────────────────────────┘ │
│                                      │
│  📁 二手出售 > 资产变现              │
│  📝 出售：iPhone 15                │
│                                      │
│  [ 记 账 ]                          │
└────────────────────────────────────┘

明细页记账记录 (src/pages/records/index.vue)
┌────────────────────────────────────┐
│  05-09 12:30                        │
│  星巴克咖啡                         │
│  💵 储蓄卡  |  📁 餐饮 > 咖啡      │
│  -¥200.00                          │
└────────────────────────────────────┘
```

### 交互流程

#### 1. 记账选择账户
- 点击账户选择器
- 弹出账户列表弹窗（按类型分组）
- 选择账户后，账户余额实时显示在选择器

#### 2. 记账时记入资产（仅支出类型）
- 选择支出分类后，金额输入区下方出现"记入资产"开关
- 打开开关，展开资产字段：
  - 品类标签（选择后自动推荐折旧方法）
  - 折旧方法（直线法/双倍余额递减法）
  - 计划使用时长（月）
  - 预期残值（元）
  - 资产名称（默认取分类名）
- 点击"记账"完成时：
  - 创建一笔支出记录
  - 同时创建一条折旧资产记录

#### 3. 记账提交
- 用户完成记账输入
- 点击"记账"按钮
- 请求记账 API，包含 accountId
- 如开启"记入资产"，同时请求创建折旧资产 API
- 服务端更新账户余额
- 返回成功后，更新本地账户缓存

#### 4. 记账成功
- 显示记账确认卡片
- 显示关联账户名称
- 显示 FIRE 时间换算（如果开启）
- 显示更新后的账户余额

#### 5. 编辑记账
- 进入编辑页
- 修改金额/账户/分类等
- 如修改金额导致资产价值变化，提示用户
- 提交时计算差额
- 服务端回滚旧账户余额，重算新账户余额

#### 6. 删除记账
- 点击删除
- 确认删除
- 服务端回滚账户余额

#### 7. 折旧资产处置后自动生成收入
- 用户在折旧资产详情页点击"处置"→"卖出"
- 填写卖出价格并确认
- 系统自动：
  - 更新资产状态为"已处置"
  - 在记账模块生成一笔收入记录（金额=卖出价，分类=二手出售/资产变现）
  - 备注自动填"出售：资产名称"

### 转账特殊处理
```
转账：从储蓄卡 ¥1,000 → 支付宝
┌────────────────────────────────────┐
│  转账                              │
│  储蓄卡        -------->  支付宝    │
│  ¥12,345.67              ¥5,678.90 │
│  (转出账户)              (转入账户)  │
│                                      │
│        ¥1,000.00                    │
│                                      │
│  备注：奖金转账                      │
└────────────────────────────────────┘

处理逻辑：
1. 储蓄卡余额 = 12,345.67 - 1,000 = 11,345.67
2. 支付宝余额 = 5,678.90 + 1,000 = 6,678.90
3. 净资产不变 = 12,345.67 + 5,678.90 - 其他负债
```

### 状态变化

| 状态 | 触发条件 | 行为 |
|------|----------|------|
| 账户已选 | 选择账户后 | 显示账户图标+名称+余额 |
| 余额不足 | 支出金额 > 账户余额 | 提示"余额不足"，仍可记账 |
| 记账成功 | 提交成功 | 显示确认卡片，更新余额 |
| 余额更新 | 记账/编辑/删除后 | 数字滚动动画 |
| 关联记录 | 明细显示 | 显示账户图标和名称 |
| 记入资产开关隐藏 | 记账类型为收入/转账 | 不显示开关 |
| 记入资产开关显示 | 记账类型为支出 | 显示开关 |
| 折旧资产创建 | 开关打开且记账成功 | 同时创建折旧资产记录 |

## UI 设计规范

### 布局
- Header 区域：高度 80rpx
- 账户选择器：高度 56rpx，内边距 16rpx
- 确认卡片：居中弹出，宽 600rpx
- 明细列表项：高度 120rpx
- 记入资产开关区域：高度 80rpx，内边距 24rpx

### 颜色（卡布里蓝体系）
- 账户选择器背景：#E0F7FA（选中态）
- 账户图标：#00BFFF 描边
- 账户余额：#19BE6B（资产）/ #FA3534（负债）
- 记账确认卡片背景：#FFFFFF
- 成功图标：#19BE6B
- 记入资产开关打开态：#00BFFF

### 字体
- 账户名称：28rpx，#333333
- 账户余额：24rpx，#999999
- 确认卡片金额：48rpx，#333333
- 账户标签：24rpx
- FIRE 时间：24rpx，#00BFFF
- 资产字段标签：26rpx，#666666

### 动效
- 余额变化：数字滚动动画，800ms
- 确认卡片：scale 0.9→1 + fadeIn，时长 200ms
- 记账成功：打勾动画，300ms
- 记入资产开关切换：slide 动画，200ms
- 记入资产字段展开：slideDown + fadeIn，250ms

## 数据结构

### 记账请求/响应
```typescript
// POST /api/records - 创建记账记录
interface CreateRecordRequest {
  type: 'expense' | 'income';
  amount: number;
  categoryId: string;
  subCategoryId?: string;
  accountId: string;              // 必填，关联账户
  note?: string;
  recordDate: string;            // 'YYYY-MM-DD HH:mm:ss'
  // 折旧资产关联
  createDepreciatingAsset?: {
    name: string;
    category: DepreciatingCategory;
    depreciationMethod: DepreciationMethod;
    purchasePrice: number;
    purchaseDate: string;
    expectedLifeMonths: number;
    residualValue: number;
  };
}

interface CreateRecordResponse {
  code: number;
  data: {
    record: Record;
    accountBalance: number;      // 更新后的账户余额
    depreciatingAssetId?: string; // 如创建了折旧资产
  };
}

// POST /api/records/transfer - 转账
interface TransferRequest {
  fromAccountId: string;         // 转出账户
  toAccountId: string;           // 转入账户
  amount: number;
  note?: string;
  recordDate: string;
}

// PUT /api/records/:id - 更新记账记录
interface UpdateRecordRequest {
  type?: 'expense' | 'income';
  amount?: number;
  categoryId?: string;
  subCategoryId?: string;
  accountId?: string;           // 可修改账户
  note?: string;
  recordDate?: string;
}

// 记账记录（更新）
interface Record {
  id: string;
  type: 'expense' | 'income' | 'transfer';
  amount: number;
  categoryId: string;
  categoryName: string;
  subCategoryId?: string;
  subCategoryName?: string;
  accountId: string;
  accountName: string;           // 账户快照
  accountIcon: string;           // 图标快照
  accountSnapshot?: string;      // 删除账户后保留
  note?: string;
  recordDate: string;
  // FIRE 时间换算
  fireDays?: number;             // 支出换算的 FIRE 天数
  // 折旧资产关联
  depreciatingAssetId?: string;   // 关联的折旧资产ID
  createdAt: string;
  updatedAt: string;
}
```

### 折旧资产创建数据结构
```typescript
// 品类类型（复用 depreciating-asset 定义）
type DepreciatingCategory = 
  | 'phone' | 'computer' | 'camera' | 'appliance' 
  | 'footwear' | 'furniture' | 'bag' | 'sports' | 'other';

// 折旧方法（复用 depreciating-asset 定义）
type DepreciationMethod = 'straight-line' | 'double-declining-balance';

// 品类推荐参数（复用 depreciating-asset 定义）
interface CategoryDefaults {
  defaultDepreciationMethod: DepreciationMethod;
  defaultLifeMonths: number;
  residualRate: number;
}
```

### 账户余额变动日志
```typescript
// 余额变动记录（服务端记录，用于审计）
interface BalanceChangeLog {
  id: string;
  accountId: string;
  recordId: string;              // 关联记账记录
  type: 'expense' | 'income' | 'transfer_out' | 'transfer_in' | 'adjustment' | 'depreciation';
  amount: number;                // 正负金额
  balanceBefore: number;         // 变动前余额
  balanceAfter: number;           // 变动后余额
  createdAt: string;
}
```

## 与现有功能的关联

### 依赖关系
- **依赖**：F1 account-system
- **依赖**：depreciating-asset（折旧资产生成）
- **被依赖**：F7 savings-rate（需要账户数据计算储蓄率）

### 需要修改的文件
- `src/pages/record/index.vue` - 记账页（更新账户选择逻辑，添加记入资产开关）
- `src/pages/record/components/AccountSelector.vue` - 账户选择器（更新）
- `src/pages/record/components/DepreciatingAssetSwitch.vue` - 新增记入资产开关组件
- `src/pages/records/index.vue` - 明细页（显示账户信息）
- `src/api/record.ts` - 更新记账 API（支持折旧资产关联）

### 新增文件
- `src/components/RecordConfirmCard.vue` - 记账确认卡片组件
- `src/pages/record/components/DepreciatingAssetSwitch.vue` - 记入资产开关组件
- `src/store/accountStore.ts` - 账户状态管理（Pinia）

## 边界情况

1. **账户未选择**
   - 记账前必须选择账户
   - 未选择时"记账"按钮禁用

2. **余额不足**
   - 提示"余额不足，当前余额 ¥XXX"
   - 用户确认后可继续记账
   - 允许余额变为负数（信用卡场景）

3. **账户被删除**
   - 记账记录保留账户快照
   - 显示"已删除账户"

4. **编辑时切换账户**
   - 回滚原账户余额
   - 更新新账户余额
   - 确保总净资产不变

5. **删除转账**
   - 回滚两个账户的余额
   - 转出账户增加，转入账户减少

6. **记账与余额不同步**
   - 使用事务保证一致性
   - 失败时回滚整笔记账

7. **并发记账**
   - 使用乐观锁
   - 余额冲突时提示刷新

8. **离线记账**
   - 本地记录记账请求
   - 联网后同步到服务端
   - 同步后更新账户余额

9. **记入资产开关未打开**
   - 不创建折旧资产
   - 正常记账流程

10. **记入资产字段未填完**
    - 点击记账时校验
    - 高亮提示未填字段
    - 不提交

11. **折旧资产处置生成收入失败**
    - 处置操作使用事务
    - 失败时回滚资产状态
    - 提示用户重试
