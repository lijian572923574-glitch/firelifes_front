# 资产总览页 - 实施计划

## [ ] Task 1: 更新资产总览 API
- **Priority**: P0
- **Depends On**: None
- **File**: `src/api/assets/overview.ts`
- **Description**: 
  - 更新 GET /api/assets/overview 响应
  - 添加各子类型账户列表
  - 添加固定资产汇总（来自 fixed-asset）
  - 添加折旧资产汇总（来自 depreciating-asset）
  - 添加本月折旧额
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3, AC-4, AC-5, AC-6, AC-7
- **Test Requirements**: `api-mock` TR-1.1: API 返回正确数据

## [ ] Task 2: 创建固定资产卡片组件
- **Priority**: P0
- **Depends On**: None
- **File**: `src/components/FixedAssetCard.vue`
- **Description**: 
  - 组件 props: asset (FixedAsset)
  - 显示：图标 + 名称 + 净权益 + 增值率
  - 增值率颜色：绿色（增值）/ 红色（贬值）/ 灰色（持平）
  - 超期显示"⚠️估值待更新"
- **Acceptance Criteria Addressed**: AC-3
- **Test Requirements**: `human-judgment` TR-2.1: 卡片展示正确

## [ ] Task 3: 创建折旧资产卡片组件
- **Priority**: P0
- **Depends On**: None
- **File**: `src/components/DepreciatingAssetCard.vue`
- **Description**: 
  - 组件 props: asset (DepreciatingAsset)
  - 显示：图标 + 名称 + 当前价值 + 折旧进度
  - 折旧进度条颜色：卡布里蓝
- **Acceptance Criteria Addressed**: AC-4
- **Test Requirements**: `human-judgment` TR-3.1: 卡片展示正确

## [ ] Task 4: 更新资产配置环形图
- **Priority**: P0
- **Depends On**: Task 1
- **File**: `src/components/AssetAllocationChart.vue`
- **Description**: 
  - 更新为5个分类：存款、投资、房产、折旧资产、负债
  - 更新颜色配置
  - 点击分类显示详细数据
- **Acceptance Criteria Addressed**: AC-2
- **Test Requirements**: `human-judgment` TR-4.1: 环形图展示正确

## [ ] Task 5: 更新资产总览页
- **Priority**: P0
- **Depends On**: Task 1, Task 2, Task 3, Task 4
- **File**: `src/pages/assets/index.vue`
- **Description**: 
  - 更新净资产计算（包含4类资产）
  - 更新资产配置环形图
  - 新增固定资产区块
  - 新增折旧资产区块
  - 更新账户卡片列表（按4类资产分组）
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3, AC-4, AC-5, AC-6, AC-7
- **Test Requirements**: `integration-test` TR-5.1: 页面展示完整

## [ ] Task 6: 添加路由配置
- **Priority**: P0
- **Depends On**: Task 5
- **File**: `src/router/index.ts`
- **Description**: 
  - 确认 /pages/assets/index 路由
- **Acceptance Criteria Addressed**: None
- **Test Requirements**: `manual` TR-6.1: 路由跳转正常
