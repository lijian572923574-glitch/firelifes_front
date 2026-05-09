# 储蓄率追踪 - 实施计划

## [ ] Task 1: 创建储蓄率趋势页面
- **Priority**: P0
- **Depends On**: None
- **File**: `src/pages/analytics/savings.vue`
- **Description**: 
  - 创建储蓄率趋势页骨架
  - 定义页面布局
  - 集成 Loading 状态
- **Acceptance Criteria Addressed**: N/A（页面结构）

## [ ] Task 2: 创建储蓄率标签组件
- **Priority**: P0
- **Depends On**: None
- **File**: `src/components/SavingsRateBadge.vue`
- **Description**: 
  - 显示进度条和百分比
  - 颜色根据分级着色
  - 高度 24rpx，圆角 12rpx
- **Acceptance Criteria Addressed**: AC-1, AC-3

## [ ] Task 3: 实现储蓄率计算
- **Priority**: P0
- **Depends On**: None
- **File**: `src/utils/savingsCalculator.ts`
- **Description**: 
  - 计算月度储蓄率
  - 计算年度累计储蓄率
  - 判断颜色分级
- **Acceptance Criteria Addressed**: AC-2, AC-3

## [ ] Task 4: 实现柱状图组件
- **Priority**: P0
- **Depends On**: Task 3
- **File**: `src/components/SavingsRateChart.vue`
- **Description**: 
  - 使用 echarts 或 uCharts
  - 显示近12个月柱状图
  - 柱子颜色按分级
  - 高度动画加载
- **Acceptance Criteria Addressed**: AC-4

## [ ] Task 5: 调用储蓄率 API
- **Priority**: P0
- **Depends On**: Task 3
- **File**: `src/api/analytics.ts`, `src/pages/analytics/savings.vue`
- **Description**: 
  - 创建 GET /api/analytics/savings-rate 接口
  - 页面加载时调用
  - 更新组件数据
- **Acceptance Criteria Addressed**: N/A（数据加载）

## [ ] Task 6: 实现年度累计展示
- **Priority**: P0
- **Depends On**: Task 3
- **File**: `src/pages/analytics/savings.vue`
- **Description**: 
  - 显示年度已存金额
  - 显示累计储蓄率
  - 数字滚动动画
- **Acceptance Criteria Addressed**: AC-5

## [ ] Task 7: 实现月度明细列表
- **Priority**: P1
- **Depends On**: Task 3
- **File**: `src/components/MonthlySavingsItem.vue`, `src/pages/analytics/savings.vue`
- **Description**: 
  - 列表展示每月数据
  - 显示月份、收入、支出、储蓄率
- **Acceptance Criteria Addressed**: N/A（列表展示）

## [ ] Task 8: 集成到明细页
- **Priority**: P0
- **Depends On**: Task 2
- **File**: `src/pages/records/index.vue`
- **Description**: 
  - 明细页顶部添加储蓄率标签
  - 点击进入储蓄率趋势页
- **Acceptance Criteria Addressed**: AC-1

## [ ] Task 9: 测试和修复
- **Priority**: P0
- **Depends On**: Task 1-8
- **File**: N/A
- **Description**: 
  - 全流程测试
  - 测试颜色分级
  - 修复发现的问题
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3, AC-4, AC-5
