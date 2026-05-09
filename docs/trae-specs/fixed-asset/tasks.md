# 固定资产管理 - 实施计划

## [ ] Task 1: 创建固定资产 API 接口
- **Priority**: P0
- **Depends On**: None
- **File**: `src/api/assets/fixed.ts`
- **Description**: 
  - 创建 GET /api/assets/fixed - 获取固定资产列表
  - 创建 GET /api/assets/fixed/:id - 获取详情
  - 创建 POST /api/assets/fixed - 创建固定资产
  - 创建 PUT /api/assets/fixed/:id - 更新固定资产
  - 创建 PUT /api/assets/fixed/:id/valuation - 更新估值
  - 创建 PUT /api/assets/fixed/:id/link-liability - 关联负债
  - 创建 DELETE /api/assets/fixed/:id/link-liability - 解除关联
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3, AC-4, AC-5
- **Test Requirements**: `api-mock` TR-1.1: 各接口返回符合数据结构定义

## [ ] Task 2: 创建固定资产品类常量
- **Priority**: P0
- **Depends On**: None
- **File**: `src/constants/fixed-asset-categories.ts`
- **Description**: 
  - 定义 FixedAssetCategory 类型（property/parking/shop/other）
  - 定义 CATEGORY_ICONS 常量（品类→图标名称映射）
  - 导出 getCategoryIcon(category) 函数
- **Acceptance Criteria Addressed**: None
- **Test Requirements**: `unit-test` TR-2.1: 函数返回正确图标

## [ ] Task 3: 创建固定资产卡片组件
- **Priority**: P0
- **Depends On**: None
- **File**: `src/components/FixedAssetCard.vue`
- **Description**: 
  - 组件 props: asset (FixedAsset)
  - 显示：资产图标 + 名称 + 品类标签 + 净权益 + 估值 + 增值率
  - 增值率颜色：绿色（增值）/ 红色（贬值）/ 灰色（持平）
  - 关联负债信息展示
  - 估值过期提醒展示
  - 点击跳转详情页
- **Acceptance Criteria Addressed**: AC-2, AC-5
- **Test Requirements**: `human-judgment` TR-3.1: 卡片布局和信息展示正确

## [ ] Task 4: 创建估值历史组件
- **Priority**: P1
- **Depends On**: None
- **File**: `src/components/ValuationHistory.vue`
- **Description**: 
  - 组件 props: records (ValuationRecord[])
  - ECharts 折线图展示估值趋势
  - 列表展示每条记录（日期 + 金额 + 标记）
  - 标记购入记录和当前记录
- **Acceptance Criteria Addressed**: AC-3
- **Test Requirements**: `human-judgment` TR-4.1: 图表渲染正确

## [ ] Task 5: 创建估值更新弹窗组件
- **Priority**: P0
- **Depends On**: None
- **File**: `src/components/UpdateValuationModal.vue`
- **Description**: 
  - 组件 props: visible (Boolean), asset (FixedAsset)
  - 组件 emits: close, confirm (valuationData)
  - 显示当前估值
  - 新估值输入框
  - 增值/贬值计算显示
  - 更新日期选择（默认当天）
  - 确认后调用 API
- **Acceptance Criteria Addressed**: AC-3
- **Test Requirements**: `human-judgment` TR-5.1: 弹窗交互流畅

## [ ] Task 6: 创建固定资产列表页
- **Priority**: P0
- **Depends On**: Task 1, Task 3
- **File**: `src/pages/assets/fixed/index.vue`
- **Description**: 
  - 顶部汇总区：总净权益、总估值
  - 列表渲染：FixedAssetCard
  - 空态：引导"还没有固定资产"
  - 请求 GET /api/assets/fixed
- **Acceptance Criteria Addressed**: AC-2
- **Test Requirements**: `integration-test` TR-6.1: 列表数据正确展示

## [ ] Task 7: 创建固定资产详情页
- **Priority**: P0
- **Depends On**: Task 1, Task 3, Task 4, Task 5
- **File**: `src/pages/assets/fixed/detail.vue`
- **Description**: 
  - 请求 GET /api/assets/fixed/:id
  - 顶部：资产名称 + 品类标签 + 状态标签
  - 大字净权益（卡布里蓝，负值显示红色）
  - 估值信息和增值率
  - 估值历史图表（ValuationHistory）
  - 关联负债卡片
  - 操作按钮：更新估值 / 编辑 / 关联负债
  - 估值过期提醒
- **Acceptance Criteria Addressed**: AC-2, AC-3, AC-4, AC-5, AC-6, AC-7
- **Test Requirements**: `integration-test` TR-7.1: 详情页数据完整

## [ ] Task 8: 创建固定资产编辑页
- **Priority**: P0
- **Depends On**: Task 1, Task 2
- **File**: `src/pages/assets/fixed/edit.vue`
- **Description**: 
  - 支持新增和编辑两种模式
  - 表单字段：名称、品类、购入价、购入日期、当前估值、关联负债
  - 关联负债后实时显示净权益计算
  - 表单校验：必填项、格式校验
  - 保存后跳转详情页
- **Acceptance Criteria Addressed**: AC-1
- **Test Requirements**: `integration-test` TR-8.1: 表单交互正常

## [ ] Task 9: 创建资产总览页固定资产区块
- **Priority**: P0
- **Depends On**: Task 1, Task 3
- **File**: `src/pages/assets/index.vue`
- **Description**: 
  - 在资产总览页新增"固定资产"区块
  - 展示：总净权益 + "查看全部"入口
  - 点击"查看全部"跳转列表页
  - 请求汇总数据 GET /api/assets/fixed
- **Acceptance Criteria Addressed**: AC-2
- **Test Requirements**: `human-judgment` TR-9.1: 区块位置和样式符合设计

## [ ] Task 10: 创建固定资产 Pinia Store
- **Priority**: P0
- **Depends On**: Task 1
- **File**: `src/store/modules/fixed-assets.ts`
- **Description**: 
  - 定义 state: assets, currentAsset, loading, summary
  - 定义 actions: fetchAssets, fetchAssetDetail, createAsset, updateAsset, updateValuation, linkLiability, unlinkLiability
  - 定义 getters: totalNetEquity, totalCurrentValue
  - 本地缓存：读取缓存优先，请求后更新缓存
- **Acceptance Criteria Addressed**: All
- **Test Requirements**: `unit-test` TR-10.1: Store 状态管理正确

## [ ] Task 11: 添加路由配置
- **Priority**: P0
- **Depends On**: Task 6, Task 7, Task 8
- **File**: `src/router/index.ts`
- **Description**: 
  - 添加 /pages/assets/fixed/index 路由
  - 添加 /pages/assets/fixed/detail 路由
  - 添加 /pages/assets/fixed/edit 路由
- **Acceptance Criteria Addressed**: None
- **Test Requirements**: `manual` TR-11.1: 路由跳转正常
