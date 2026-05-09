# 功能名称

> 版本：v1.0 | 状态：🟡设计中 | 最后更新：2026-05-09

## 版本历史
| 版本 | 日期 | 变更内容 | 作者 |
|------|------|---------|------|
| v1.0 | 2026-05-09 | 初始版本 | AI |

---

> 最后更新：2026-05-09

---

## 功能概述
账户从"记账标签"升级为"一等公民"，成为个人财务管理的核心实体。用户可以创建、维护多种类型的账户（资产类和负债类），每种账户类型有不同的数据结构和管理方式。资产类账户包含4种类型：现金类、投资类、固定资产、折旧资产。

## 用户故事
作为用户，我希望将我的财务账户（银行卡、支付宝、微信钱包、信用卡、房贷等）统一管理，并看到每个账户的实时余额和价值，这样我可以清晰掌握自己的财务状况。

## 交互设计

### 页面结构

```
账户管理页 (src/pages/account/index.vue)
┌────────────────────────────────────┐
│  ← 我的账户                    [+] │
├────────────────────────────────────┤
│  资产类                              │
│  ───────────────────────────────── │
│  💵 现金类                           │
│  ┌────────────────────────────────┐ │
│  │ 💵 现金             ¥3,210.00 > │ │
│  └────────────────────────────────┘ │
│  ┌────────────────────────────────┐ │
│  │ 🏦 储蓄卡           ¥12,345.67 > │ │
│  └────────────────────────────────┘ │
│  ┌────────────────────────────────┐ │
│  │ 💚 支付宝           ¥5,678.90 > │ │
│  └────────────────────────────────┘ │
│  💰 投资类                           │
│  ┌────────────────────────────────┐ │
│  │ 📈 股票账户           ¥50,000 > │ │
│  │ 市值 ¥52,300  收益率 +4.6%    │ │
│  └────────────────────────────────┘ │
│  🏠 固定资产                         │
│  ┌────────────────────────────────┐ │
│  │ 🏠 自住房产         ¥1,200,000 > │ │
│  │ 净权益  增值 +25%              │ │
│  └────────────────────────────────┘ │
│  🔄 折旧资产                         │
│  ┌────────────────────────────────┐ │
│  │ 📱 iPhone 15         ¥4,500 > │ │
│  │ 当前价值  折旧中               │ │
│  └────────────────────────────────┘ │
│                                      │
│  负债类                              │
│  ───────────────────────────────── │
│  💳 信用卡                           │
│  ┌────────────────────────────────┐ │
│  │ 💳 招商信用卡       ¥-2,345.00 > │ │
│  └────────────────────────────────┘ │
│  🏦 房贷                             │
│  ┌────────────────────────────────┐ │
│  │ 🏦 招商房贷         ¥-800,000 > │ │
│  └────────────────────────────────┘ │
└────────────────────────────────────┘

账户编辑页 (src/pages/account/edit.vue)
┌────────────────────────────────────┐
│  ← 新建账户                  [保存] │
├────────────────────────────────────┤
│  账户名称                            │
│  ┌────────────────────────────────┐ │
│  │ 输入账户名称...                │ │
│  └────────────────────────────────┘ │
│                                      │
│  账户类型                            │
│  ┌────────────────────────────────┐ │
│  │ 资产类                         │ │
│  │ [现金类] [投资类] [固定资产]   │ │
│  │ [折旧资产]                     │ │
│  └────────────────────────────────┘ │
│  ┌────────────────────────────────┐ │
│  │ 负债类                         │ │
│  │ [信用卡] [花呗白条] [房贷]     │ │
│  │ [车贷] [借款]                  │ │
│  └────────────────────────────────┘ │
│                                      │
│  账户图标                            │
│  ┌────────────────────────────────┐ │
│  │  [💵] [💚] [💙] [🏦] [💳]  [+] │ │
│  └────────────────────────────────┘ │
│                                      │
│  ── 以下字段根据账户类型显示 ──      │
│                                      │
│  [现金类/投资类]                     │
│  初始余额                            │
│  ┌────────────────────────────────┐ │
│  │ ¥ 0.00                         │ │
│  └────────────────────────────────┘ │
│                                      │
│  [投资类] 额外字段                   │
│  持仓成本                            │
│  ┌────────────────────────────────┐ │
│  │ ¥ 0.00                         │ │
│  └────────────────────────────────┘ │
│                                      │
│  [固定资产] 额外字段                 │
│  购入价                             │
│  ┌────────────────────────────────┐ │
│  │ ¥ 0.00                         │ │
│  └────────────────────────────────┘ │
│  品类：○ 房产 ○ 车位 ○ 商铺 ○ 其他  │
│  关联负债账户                        │
│  ┌────────────────────────────────┐ │
│  │ [选择账户 ▼]                   │ │
│  └────────────────────────────────┘ │
│                                      │
│  [折旧资产] 额外字段                 │
│  购入价                             │
│  ┌────────────────────────────────┐ │
│  │ ¥ 0.00                         │ │
│  └────────────────────────────────┘ │
│  品类标签：                          │
│  ○ 手机 ○ 电脑 ○ 相机 ○ 家电       │
│  ○ 鞋服 ○ 家具 ○ 包袋 ○ 运动 ○ 其他│
│  折旧方法：                          │
│  ○ 直线法  ○ 双倍余额递减法         │
│  计划使用月数                       │
│  ┌────────────────────────────────┐ │
│  │ [36]                          │ │
│  └────────────────────────────────┘ │
│  预期残值                           │
│  ┌────────────────────────────────┐ │
│  │ ¥ 0.00                         │ │
│  └────────────────────────────────┘ │
│                                      │
│  [信用卡/花呗白条] 额外字段          │
│  账单日                             │
│  ┌────────────────────────────────┐ │
│  │ [1] 日                         │ │
│  └────────────────────────────────┘ │
│  还款日                             │
│  ┌────────────────────────────────┐ │
│  │ [15] 日                        │ │
│  └────────────────────────────────┘ │
│                                      │
│  [房贷/车贷] 额外字段               │
│  贷款总额                           │
│  ┌────────────────────────────────┐ │
│  │ ¥ 0.00                         │ │
│  └────────────────────────────────┘ │
│  贷款期限（月）                     │
│  ┌────────────────────────────────┐ │
│  │ [240]                          │ │
│  └────────────────────────────────┘ │
│                                      │
└────────────────────────────────────┘
```

### 账户类型体系

#### 资产类账户 (AccountType: 'asset')

| 类型标识 | 中文名称 | 余额含义 | 特殊字段 | 说明 |
|---------|---------|---------|---------|------|
| cash | 现金类 | 余额即价值 | 无 | 现金、储蓄卡、支付宝、微信 |
| investment | 投资类 | 市值波动 | costBasis, marketValue, lastUpdateDate | 股票、基金、债券账户 |
| fixed | 固定资产 | 净权益 | purchasePrice, category, linkedLiabilityAccountId | 房产、车位、商铺 |
| depreciating | 折旧资产 | 当前价值 | purchasePrice, depreciationMethod, expectedLifeMonths, residualValue | 手机、电脑等 |

#### 负债类账户 (AccountType: 'liability')

| 类型标识 | 中文名称 | 余额含义 | 特殊字段 | 说明 |
|---------|---------|---------|---------|------|
| credit_card | 信用卡 | 已消费未还款 | billDay, repayDay | 信用卡 |
| consumer_credit | 消费信贷 | 花呗/白条未还 | creditLimit, usedAmount | 花呗、白条 |
| mortgage | 房贷 | 剩余本金 | loanAmount, loanTermMonths, interestRate | 房贷 |
| car_loan | 车贷 | 剩余本金 | loanAmount, loanTermMonths, interestRate | 车贷 |
| loan | 借款 | 借款本金 | lender, loanDate, dueDate | 私人借款 |

### 交互流程

#### 1. 账户列表页
- 显示所有账户，按资产类/负债类分组
- 资产类下按子类型（现金/投资/固定资产/折旧资产）分组
- 点击"+"进入新建账户
- 点击账户项进入账户详情/编辑
- 长按/滑动显示删除选项
- 拖拽调整排序

#### 2. 账户编辑页
- 输入账户名称（必填，最多20字符）
- 选择账户类型（资产类/负债类，再选子类型）
- 根据子类型显示不同字段
- 选择账户图标（预设图标或自定义）
- 根据子类型填写对应字段
- 点击保存

#### 3. 删除账户
- 点击删除按钮
- 判断是否有关联记账记录
- 若有：提示"该账户有 X 笔关联记录，删除后记录保留账户快照"
- 确认后删除，更新关联记录的 accountId 为 null，保留 accountSnapshot

### 净资产计算
```
净资产 = 现金类总额 + 投资类市值 + 固定资产净权益 + 折旧资产当前价值 - 负债总额

其中：
- 现金类总额 = SUM(cash账户余额)
- 投资类市值 = SUM(investment账户marketValue)
- 固定资产净权益 = SUM(fixed账户.currentValue - linkedLiabilityBalance)
- 折旧资产当前价值 = SUM(depreciating账户.currentValue)
- 负债总额 = SUM(所有负债账户余额)
```

### 状态变化

| 状态 | 触发条件 | 行为 |
|------|----------|------|
| 空态 | 无账户 | 显示引导卡片"添加你的第一个账户" |
| 正常 | 有账户 | 显示账户列表，按类型分组 |
| 编辑中 | 点击账户项 | 进入编辑页 |
| 删除确认 | 点击删除 | 显示二次确认弹窗 |
| 有关联记录 | 删除有关联的账户 | 提示并软删除（保留快照） |
| 排序中 | 长按账户项 | 进入拖拽模式 |
| 投资类待更新 | 投资类账户超过24小时未更新市值 | 显示"市值待更新"提示 |

## UI 设计规范

### 布局
- 页面内边距：32rpx
- 账户卡片：高度 112rpx，圆角 16rpx
- 卡片间距：16rpx
- 图标尺寸：64rpx
- 分组标题：高度 64rpx，字号 24rpx，颜色 #999999

### 颜色（卡布里蓝体系）
- 页面背景：#FFFFFF
- 卡片背景：#FFFFFF
- 主色描边图标：#00BFFF
- 资产余额：#19BE6B（绿色）
- 负债余额：#FA3534（红色）
- 增值率：#19BE6B（绿色）
- 减值率：#FA3534（红色）
- 新增按钮：#00BFFF
- 分割线：#F5F5F5

### 字体
- 账户名称：32rpx，#333333，加粗
- 余额/市值：36rpx，资产 #19BE6B，负债 #FA3534
- 净权益：36rpx，#00BFFF
- 分组标题：24rpx，#999999
- 子类型标题：26rpx，#666666
- 投资类额外信息：24rpx，#999999
- 占位文字：28rpx，#CCCCCC

### 动效
- 列表加载：fadeIn，时长 300ms，stagger 50ms
- 卡片点击：scale 0.98，时长 100ms
- 弹窗出现：slideUp + fadeIn，时长 200ms
- 拖拽：阴影加深，scale 1.02

## 数据结构

### 账户数据结构
```typescript
// 资产类账户类型
type AssetAccountSubType = 'cash' | 'investment' | 'fixed' | 'depreciating';

// 负债类账户类型
type LiabilityAccountSubType = 'credit_card' | 'consumer_credit' | 'mortgage' | 'car_loan' | 'loan';

interface Account {
  id: string;                      // UUID
  userId: string;                  // 用户ID
  name: string;                    // 账户名称（最多20字符）
  icon: string;                    // 图标类型
  type: 'asset' | 'liability';     // 账户大类
  subType: AssetAccountSubType | LiabilityAccountSubType;  // 账户子类型
  // 通用余额字段
  initialBalance: number;          // 初始余额
  currentBalance: number;          // 当前余额
  // 资产类额外字段（根据 subType）
  // 投资类
  costBasis?: number;             // 持仓成本
  marketValue?: number;           // 当前市值
  lastValueUpdateDate?: string;   // 最后市值更新日期
  // 固定资产
  purchasePrice?: number;         // 购入价
  currentValue?: number;           // 当前估值
  fixedAssetCategory?: 'property' | 'parking' | 'shop' | 'other';
  linkedLiabilityAccountId?: string;  // 关联负债账户ID
  // 折旧资产
  depreciatingCategory?: DepreciatingCategory;  // 品类
  depreciationMethod?: DepreciationMethod;       // 折旧方法
  expectedLifeMonths?: number;    // 计划使用月数
  residualValue?: number;          // 预期残值
  // 负债类额外字段（根据 subType）
  // 信用卡/消费信贷
  billDay?: number;               // 账单日
  repayDay?: number;              // 还款日
  creditLimit?: number;           // 信用额度（消费信贷）
  // 房贷/车贷
  loanAmount?: number;            // 贷款总额
  loanTermMonths?: number;         // 贷款期限（月）
  interestRate?: number;          // 利率
  // 借款
  lender?: string;                // 出借人
  loanDate?: string;              // 借款日期
  dueDate?: string;               // 到期日期
  // 通用字段
  currency: string;               // 币种，默认 CNY
  order: number;                  // 排序
  isVisible: boolean;             // 是否显示在总览
  isDeleted: boolean;              // 软删除标记
  createdAt: string;
  updatedAt: string;
}

// 折旧资产相关类型（复用 depreciating-asset 模块定义）
type DepreciatingCategory = 
  | 'phone' | 'computer' | 'camera' | 'appliance' 
  | 'footwear' | 'furniture' | 'bag' | 'sports' | 'other';

type DepreciationMethod = 'straight-line' | 'double-declining-balance';

// 预设图标类型
type AccountIcon = 
  | 'cash'           // 现金
  | 'savings'        // 储蓄卡
  | 'wechat'         // 微信
  | 'alipay'         // 支付宝
  | 'credit'         // 信用卡
  | 'property'       // 房产
  | 'fund'           // 基金
  | 'stock'          // 股票
  | 'housingFund'     // 公积金
  | 'car'            // 汽车
  | 'loan'           // 贷款
  | 'other';         // 其他
```

### 新增接口

```typescript
// GET /api/accounts - 获取账户列表
// GET /api/accounts?type=asset|liability - 按类型筛选
// GET /api/accounts?subType=cash|investment|fixed|depreciating - 按子类型筛选
// GET /api/accounts?visible=true - 仅获取显示在总览的账户
interface GetAccountsResponse {
  code: number;
  data: {
    accounts: Account[];
    summary: {
      totalAssets: number;           // 资产总计
      totalCash: number;              // 现金类总额
      totalInvestment: number;        // 投资类市值总额
      totalFixed: number;             // 固定资产净权益总额
      totalDepreciating: number;      // 折旧资产当前价值总额
      totalLiabilities: number;      // 负债总计
      netAssets: number;              // 净资产
    };
  };
  message?: string;
}

// POST /api/accounts - 创建账户
interface CreateAccountRequest {
  name: string;
  icon: AccountIcon;
  type: 'asset' | 'liability';
  subType: AssetAccountSubType | LiabilityAccountSubType;
  initialBalance?: number;
  // 根据 subType 添加字段
  costBasis?: number;
  marketValue?: number;
  purchasePrice?: number;
  currentValue?: number;
  fixedAssetCategory?: string;
  linkedLiabilityAccountId?: string;
  depreciatingCategory?: DepreciatingCategory;
  depreciationMethod?: DepreciationMethod;
  expectedLifeMonths?: number;
  residualValue?: number;
  billDay?: number;
  repayDay?: number;
  creditLimit?: number;
  loanAmount?: number;
  loanTermMonths?: number;
  interestRate?: number;
  lender?: string;
  loanDate?: string;
  dueDate?: string;
  currency?: string;
}

interface CreateAccountResponse {
  code: number;
  data: {
    account: Account;
  };
}

// PUT /api/accounts/:id - 更新账户
interface UpdateAccountRequest {
  name?: string;
  icon?: AccountIcon;
  initialBalance?: number;
  // 根据 subType 添加字段
  costBasis?: number;
  marketValue?: number;
  purchasePrice?: number;
  currentValue?: number;
  fixedAssetCategory?: string;
  linkedLiabilityAccountId?: string;
  // ... 其他字段
}

// PUT /api/accounts/:id/valuation - 更新投资类账户市值
interface UpdateValuationRequest {
  marketValue: number;
}

interface UpdateValuationResponse {
  code: number;
  data: {
    account: Account;
    profitLoss: number;             // 盈亏金额
    profitLossRate: number;          // 盈亏率
  };
}

// DELETE /api/accounts/:id - 删除账户
interface DeleteAccountResponse {
  code: number;
  data: {
    affectedRecordsCount: number;    // 受影响的记账记录数
  };
}
```

## 与现有功能的关联

### 依赖关系
- **依赖**：无（基础模块）
- **被依赖**：F3 record-account-linkage、F5 asset-overview、F7 fire-report

### 需要修改的文件
- `src/pages/account/index.vue` - 更新账户列表，4类资产分组展示
- `src/pages/account/edit.vue` - 更新编辑页，支持9种子类型
- `src/api/account.js` - 更新 API 接口
- `src/store/modules/account.js` - 更新状态管理

## 边界情况

1. **投资类账户市值未更新**
   - 超过24小时未更新显示提醒
   - 净资产计算使用最新市值

2. **固定资产关联的负债账户余额变化**
   - 固定资产详情页实时查询关联负债余额
   - 资产总览页也需实时查询

3. **折旧资产与账户的关联**
   - 折旧资产可独立创建（记账时），也可从账户页创建
   - 折旧资产的余额自动计算

4. **删除有处置资产的折旧账户**
   - 提示：该账户关联折旧资产，删除后资产保留
   - 折旧资产的关联账户置空

5. **账户余额为负（信用卡/借款）**
   - 信用卡：正常，未还金额为负
   - 借款：正常，应还金额为负
