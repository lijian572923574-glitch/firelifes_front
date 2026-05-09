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
折旧资产是指随时间推移价值逐渐减少的资产（如手机、相机、电脑、鞋服等）。通过"记入资产"开关，用户在记账当下即可将支出转化为折旧资产，系统自动计算每月折旧额和当前价值，帮助用户了解资产的实际损耗和剩余价值。

## 用户故事
作为用户，我希望能将我的大件支出（如手机、相机、鞋服）记入资产，看到它们随时间的价值损耗。这样我可以：
1. 了解"买的东西还值多少"
2. 在处置资产（卖出/报废）时自动记录收支
3. 在月度报告中看到折旧损耗

## 交互设计

### 页面结构

```
记账页 (src/pages/record/index.vue)
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
└────────────────────────────────────┘

折旧资产列表页 (src/pages/assets/depreciating/index.vue)
┌────────────────────────────────────┐
│  ← 折旧资产                    [+] │
├────────────────────────────────────┤
│  当前总价值        本月折旧          │
│  ¥2,450.00        -¥85.50          │
│                                      │
│  [使用中] [已处置]                   │
│                                      │
│  ┌────────────────────────────────┐ │
│  │ 👟 鞋子                         │ │
│  │ 鞋服 | 直线法  ¥481.25  ████░░ │ │
│  └────────────────────────────────┘ │
│  ┌────────────────────────────────┐ │
│  │ 📱 iPhone 15                   │ │
│  │ 数码 | 双倍余额递减  ¥4,500  ██░░░ │ │
│  └────────────────────────────────┘ │
└────────────────────────────────────┘

折旧资产详情页 (src/pages/assets/depreciating/detail.vue)
┌────────────────────────────────────┐
│  ←                           [...] │
├────────────────────────────────────┤
│  📱 iPhone 15                      │
│  手机 | 数码        [使用中]         │
│                                      │
│         ¥4,500.00                   │
│          当前价值                    │
│                                      │
│  折旧方法：双倍余额递减法            │
│                                      │
│  ┌────────────────────────────────┐ │
│  │      [价值曲线图]                │ │
│  │      购入价→当前价值（曲线）     │ │
│  └────────────────────────────────┘ │
│                                      │
│  购入价        ¥5,000.00            │
│  购入日期      2024-05-09            │
│  计划使用时长  36个月                │
│  预期残值      ¥500.00              │
│  月折旧额      ¥166.67（第1月）     │
│  已使用月数    3个月                 │
│                                      │
│  [调整价值]    [处置]                │
└────────────────────────────────────┘

处置弹窗 (dispose-modal)
┌────────────────────────────────────┐
│  处置资产                           │
│                                      │
│  iPhone 15（当前价值 ¥4,500.00）   │
│                                      │
│  ○ 报废 — 坏了/丢了，价值归0        │
│  ○ 赠送 — 送人了，价值归0           │
│  ○ 卖出 — 二手卖出                  │
│     └─ 卖出价格：[¥3,500]          │
│                                      │
│  处置后预计亏损：¥1,000.00          │
│                                      │
│  处置说明                           │
│  卖出后自动生成一笔收入记录          │
│                                      │
│  [取消]           [确认处置]        │
└────────────────────────────────────┘
```

### 折旧方法

本功能支持**两种**折旧方法：

#### 1. 直线法（年限平均法）
- **公式**：月折旧额 = (购入价 - 残值) ÷ 使用月数
- **特点**：每月折旧固定不变
- **适用**：适合价值相对稳定、折旧均匀的资产

#### 2. 双倍余额递减法
- **公式**：月折旧率 = 2 ÷ 使用月数，当月折旧 = 期初账面价值 × 月折旧率
- **特点**：折旧额逐月递减，前期多后期少
- **切换规则**：当剩余使用期等于或小于总使用期的40%时，自动切换为直线法
- **优势**：更符合资产实际使用价值损耗规律

### 品类默认推荐表

| 品类标签 | 默认折旧方法 | 默认使用寿命 | 默认残值率 |
|---------|------------|------------|-----------|
| 手机 | 双倍余额递减 | 36个月 | 10% |
| 电脑 | 双倍余额递减 | 48个月 | 10% |
| 相机 | 直线法 | 60个月 | 15% |
| 家电 | 直线法 | 60个月 | 10% |
| 鞋服 | 直线法 | 24个月 | 10% |
| 家具 | 直线法 | 120个月 | 15% |
| 包袋 | 直线法 | 36个月 | 15% |
| 运动 | 直线法 | 36个月 | 5% |
| 其他 | 直线法 | 24个月 | 10% |

**说明**：折旧方法选定后不可更改（与会计准则一致）

### 折旧计算示例

购入价 ¥10,000，计划使用 5年(60个月)，残值 ¥1,000

**直线法**：
- 月折旧 = (10000-1000)/60 = **¥150/月**（固定）
- 第1年末价值: ¥8,200
- 第3年末价值: ¥4,600
- 第5年末价值: ¥1,000（残值）

**双倍余额递减法**：
- 月折旧率 = 2/60 = 3.33%
- 第1月折旧: ¥10,000 × 3.33% = **¥333**
- 第12月折旧: ¥6,554 × 3.33% = **¥218**（逐月递减）
- 第1年末价值: ¥6,554
- 第3年末价值: ¥2,818
- 剩余24个月切换直线法: (2818-1000)/24 = ¥75.75/月
- 第5年末价值: ¥1,000（残值）

### 交互流程

#### 1. 记账时记入资产
1. 用户在记账页输入金额（如 ¥500）
2. 选择账户
3. 选择分类（如：鞋服 > 鞋子）
4. 金额输入区下方出现"记入资产"开关（仅支出类型显示）
5. 打开开关，展开资产字段
6. 品类标签默认与分类大类匹配（可改）
7. 选择品类后：
   - 自动推荐折旧方法（手机/电脑推荐双倍余额递减，其他推荐直线法）
   - 自动填充推荐的使用时长和残值（可改）
8. 显示当前折旧方法的说明（月折旧估算）
9. 点击"记账"完成
10. 同时生成：
    - 一笔 ¥500 支出记录
    - 一条折旧资产记录（状态：使用中）

#### 2. 查看折旧资产
1. 进入资产总览页
2. 找到"折旧资产"区块
3. 点击"查看全部"进入列表页
4. 可筛选（使用中/已处置）
5. 可排序（按价值/按购入时间）
6. 点击资产进入详情页

#### 3. 资产处置
1. 在详情页点击"处置"按钮
2. 选择处置方式：
   - **报废**：东西坏了/丢了，价值归0，不产生收入
   - **赠送**：送人了，价值归0，不产生收入
   - **卖出**：填写卖出价格，确认后自动生成收入记录
3. 处置后状态变为"已处置"，停止折旧
4. 处置记录保留在资产明细中

#### 4. 调整价值
1. 在详情页点击"调整价值"按钮
2. 输入修正后的当前价值（用于二手市场估值等）
3. 确认后更新当前价值
4. 调整记录写入资产历史

### 状态变化

| 状态 | 触发条件 | 行为 |
|------|----------|------|
| 记账中 | 选择支出分类后 | 显示"记入资产"开关 |
| 开关关闭 | 默认状态 | 不生成折旧资产 |
| 开关打开 | 用户打开开关 | 展开资产字段，可编辑 |
| 品类已选 | 选择品类标签 | 自动推荐折旧方法和参数 |
| 使用中 | 资产创建后默认状态 | 正常折旧计算 |
| 已处置 | 执行处置操作后 | 停止折旧，显示处置信息 |
| 价值已调整 | 手动调整后 | 更新当前价值，记录历史 |

## UI 设计规范

### 布局
- 记账页开关区域：高度 80rpx，内边距 24rpx
- 展开字段间距：24rpx
- 列表页卡片：高度 120rpx，圆角 16rpx，间距 16rpx
- 详情页主价值区：高度 180rpx
- 处置弹窗：宽 600rpx，居中弹出

### 颜色（卡布里蓝体系）
- 页面背景：#FFFFFF
- 主色描边图标：#00BFFF
- 开关打开态：#00BFFF
- 当前价值大字：#00BFFF
- 折旧进度条填充：#00BFFF
- 折旧进度条背景：#E0F7FA
- 已处置标签：#999999
- 报废/赠送选项：#666666
- 卖出选项：#00BFFF
- 收入金额：#19BE6B

### 字体
- 资产名称：32rpx，#333333，加粗
- 当前价值：56rpx，#00BFFF，加粗
- 品类标签：24rpx，#999999
- 卡片金额：28rpx，#00BFFF
- 折旧进度：24rpx，#666666
- 字段标签：26rpx，#666666
- 输入值：28rpx，#333333

### 动效
- 开关切换：slide 动画，200ms
- 字段展开：slideDown + fadeIn，250ms
- 列表加载：fadeIn，时长 300ms，stagger 50ms
- 卡片点击：scale 0.98，时长 100ms
- 价值变化：数字滚动动画，800ms
- 弹窗出现：slideUp + fadeIn，200ms

## 数据结构

### 折旧资产数据结构
```typescript
interface DepreciatingAsset {
  id: string;                      // UUID
  userId: string;                  // 用户ID
  name: string;                    // 资产名称
  category: DepreciatingCategory;  // 品类标签
  depreciationMethod: DepreciationMethod;  // 折旧方法
  purchasePrice: number;           // 购入价
  purchaseDate: string;            // 购入日期 'YYYY-MM-DD'
  expectedLifeMonths: number;     // 计划使用月数
  residualValue: number;           // 预期残值
  currentValue: number;            // 当前价值（自动计算/手动调整）
  status: 'active' | 'disposed';  // 状态
  disposalMethod?: 'scrapped' | 'given' | 'sold';  // 处置方式
  disposalDate?: string;           // 处置日期
  disposalPrice?: number;          // 卖出价格（仅卖出时）
  disposalNote?: string;           // 处置备注
  monthlyDepreciation: number;    // 月折旧额
  usedMonths: number;              // 已使用月数
  // 关联的记账记录
  recordId?: string;               // 购入时的记账记录ID
  createdIncomeRecordId?: string; // 卖出时生成的收入记录ID
  createdAt: string;
  updatedAt: string;
}

// 品类类型
type DepreciatingCategory = 
  | 'phone'        // 手机 36个月 10% 双倍余额递减
  | 'computer'     // 电脑 48个月 10% 双倍余额递减
  | 'camera'       // 相机 60个月 15% 直线法
  | 'appliance'    // 家电 60个月 10% 直线法
  | 'footwear'     // 鞋服 24个月 10% 直线法
  | 'furniture'    // 家具 120个月 15% 直线法
  | 'bag'          // 包袋 36个月 15% 直线法
  | 'sports'       // 运动 36个月 5% 直线法
  | 'other';       // 其他 24个月 10% 直线法

// 折旧方法类型
type DepreciationMethod = 'straight-line' | 'double-declining-balance';

// 品类推荐参数
interface CategoryDefaults {
  defaultDepreciationMethod: DepreciationMethod;
  defaultLifeMonths: number;
  residualRate: number;
}

const CATEGORY_DEFAULTS: Record<DepreciatingCategory, CategoryDefaults> = {
  phone: { defaultDepreciationMethod: 'double-declining-balance', defaultLifeMonths: 36, residualRate: 0.1 },
  computer: { defaultDepreciationMethod: 'double-declining-balance', defaultLifeMonths: 48, residualRate: 0.1 },
  camera: { defaultDepreciationMethod: 'straight-line', defaultLifeMonths: 60, residualRate: 0.15 },
  appliance: { defaultDepreciationMethod: 'straight-line', defaultLifeMonths: 60, residualRate: 0.1 },
  footwear: { defaultDepreciationMethod: 'straight-line', defaultLifeMonths: 24, residualRate: 0.1 },
  furniture: { defaultDepreciationMethod: 'straight-line', defaultLifeMonths: 120, residualRate: 0.15 },
  bag: { defaultDepreciationMethod: 'straight-line', defaultLifeMonths: 36, residualRate: 0.15 },
  sports: { defaultDepreciationMethod: 'straight-line', defaultLifeMonths: 36, residualRate: 0.05 },
  other: { defaultDepreciationMethod: 'straight-line', defaultLifeMonths: 24, residualRate: 0.1 },
};

// 折旧计算函数
interface DepreciationResult {
  monthlyDepreciation: number;  // 当前月折旧额
  currentValue: number;         // 当前价值
  depreciationRate: number;     // 折旧率（月折旧率，仅双倍余额递减法）
}

function calculateDepreciation(
  purchasePrice: number,
  lifeMonths: number,
  residualValue: number,
  usedMonths: number,
  method: DepreciationMethod
): DepreciationResult {
  if (method === 'straight-line') {
    // 直线法：月折旧 = (购入价 - 残值) / 总月数
    const monthlyDepreciation = (purchasePrice - residualValue) / lifeMonths;
    const currentValue = Math.max(purchasePrice - monthlyDepreciation * usedMonths, residualValue);
    return { monthlyDepreciation, currentValue, depreciationRate: 0 };
  } else {
    // 双倍余额递减法
    const rate = 2 / lifeMonths;  // 月折旧率
    const remainingMonths = lifeMonths - usedMonths;
    
    // 当剩余月数 <= 总月数的40%时，切换为直线法
    if (remainingMonths <= lifeMonths * 0.4) {
      const remainingValue = purchasePrice - (purchasePrice - residualValue) * (usedMonths / lifeMonths);
      const monthlyDepreciation = (remainingValue - residualValue) / remainingMonths;
      const currentValue = Math.max(remainingValue - monthlyDepreciation, residualValue);
      return { monthlyDepreciation, currentValue, depreciationRate: rate };
    }
    
    // 双倍余额递减计算
    let currentValue = purchasePrice;
    for (let i = 0; i < usedMonths; i++) {
      currentValue = Math.max(currentValue * (1 - rate), residualValue);
    }
    const monthlyDepreciation = currentValue * rate;
    
    return { monthlyDepreciation, currentValue, depreciationRate: rate };
  }
}

// 资产调整记录
interface AssetAdjustment {
  id: string;
  assetId: string;
  oldValue: number;
  newValue: number;
  reason?: string;
  createdAt: string;
};
```

### 新增接口

```typescript
// GET /api/assets/depreciating - 获取折旧资产列表
// GET /api/assets/depreciating?status=active|disposed
interface GetDepreciatingAssetsResponse {
  code: number;
  data: {
    assets: DepreciatingAsset[];
    summary: {
      totalCurrentValue: number;    // 当前总价值
      totalPurchasePrice: number;    // 购入总价
      totalMonthlyDepreciation: number;  // 本月折旧总额
      activeCount: number;           // 使用中数量
      disposedCount: number;         // 已处置数量
    };
  };
}

// GET /api/assets/depreciating/:id - 获取折旧资产详情
interface GetDepreciatingAssetDetailResponse {
  code: number;
  data: {
    asset: DepreciatingAsset;
    adjustments: AssetAdjustment[];  // 调整历史
    depreciationCurve: {
      month: string;                 // 'YYYY-MM'
      value: number;                 // 当月价值
    }[];
  };
}

// POST /api/assets/depreciating - 创建折旧资产
interface CreateDepreciatingAssetRequest {
  name: string;
  category: DepreciatingCategory;
  depreciationMethod: DepreciationMethod;  // 折旧方法
  purchasePrice: number;
  purchaseDate: string;
  expectedLifeMonths: number;
  residualValue: number;
  recordId?: string;                 // 关联的记账记录ID
}

interface CreateDepreciatingAssetResponse {
  code: number;
  data: {
    asset: DepreciatingAsset;
  };
}

// PUT /api/assets/depreciating/:id - 更新折旧资产
interface UpdateDepreciatingAssetRequest {
  name?: string;
  expectedLifeMonths?: number;
  residualValue?: number;
  currentValue?: number;            // 手动调整当前价值
}

// PUT /api/assets/depreciating/:id/dispose - 处置资产
interface DisposeDepreciatingAssetRequest {
  method: 'scrapped' | 'given' | 'sold';
  price?: number;                   // 卖出价格，仅 sold 时必填
  note?: string;
}

interface DisposeDepreciatingAssetResponse {
  code: number;
  data: {
    asset: DepreciatingAsset;
    incomeRecordId?: string;        // 卖出时生成的收入记录ID
  };
}

// GET /api/assets/depreciating/adjustments/:assetId - 获取调整历史
interface GetAdjustmentHistoryResponse {
  code: number;
  data: {
    adjustments: AssetAdjustment[];
  };
}
```

### 本地存储
```typescript
// UniApp Storage Keys
const STORAGE_KEYS = {
  DEPRECIATING_ASSETS_CACHE: 'depreciating_assets_cache',
  DEPRECIATING_ASSETS_LAST_SYNC: 'depreciating_assets_last_sync',
};
```

## 与现有功能的关联

### 依赖关系
- **依赖**：F1 account-system（账户选择）、F2 category-system（分类选择）
- **被依赖**：F5 asset-overview（资产总览展示折旧资产）、F7 fire-report（月度折旧汇总）

### 需要修改的文件
- `src/pages/record/index.vue` - 添加"记入资产"开关
- `src/pages/record/components/RecordForm.vue` - 新增资产字段组件
- `src/pages/assets/index.vue` - 新增折旧资产区块
- `src/pages/assets/depreciating/index.vue` - 新增列表页
- `src/pages/assets/depreciating/detail.vue` - 新增详情页
- `src/pages/assets/depreciating/components/DisposeModal.vue` - 新增处置弹窗
- `src/store/modules/assets.js` - 新增状态管理
- `src/api/assets.js` - 新增 API

### 新增文件
- `src/components/DepreciatingAssetCard.vue` - 折旧资产卡片组件
- `src/components/DepreciationProgress.vue` - 折旧进度条组件
- `src/components/AssetValueChart.vue` - 资产价值曲线图组件
- `src/components/DisposeModal.vue` - 处置弹窗组件

## 边界情况

1. **记账时选择"记入资产"但未填完字段**
   - 点击记账时校验：品类、折旧方法、使用时长、残值均为必填
   - 未填完时高亮提示，不提交

2. **处置时卖出价格高于当前价值**
   - 允许，不做限制
   - 处置记录中展示"赚了 ¥XX"

3. **处置时卖出价格低于当前价值**
   - 允许，不做限制
   - 处置记录中展示"亏了 ¥XX"

4. **资产已使用超过计划时长**
   - 价值保持为残值，不继续折旧
   - 详情页显示"已折旧完成"

5. **双倍余额递减法到达切换点**
   - 当剩余月数 <= 总月数×40%时，自动切换为直线法
   - 确保最终价值不低于残值

6. **自动折旧时价值已到残值**
   - 月折旧额变为 0
   - 不产生新的折旧记录

7. **删除关联的记账记录**
   - 折旧资产保留，不级联删除
   - recordId 置空

8. **资产列表为空**
   - 显示空态引导："还没有折旧资产"
   - 引导用户去记账时开启"记入资产"
