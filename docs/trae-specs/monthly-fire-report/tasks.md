# 月度FIRE报告 - 实施计划

## [ ] Task 1: 创建月度报告页面
- **Priority**: P0
- **Depends On**: None
- **File**: `src/pages/fire/report.vue`
- **Description**: 
  - 创建月度报告页骨架
  - 定义页面布局
  - 集成 Loading 状态
- **Acceptance Criteria Addressed**: AC-1

## [ ] Task 2: 创建报告数据卡片组件
- **Priority**: P0
- **Depends On**: Task 1
- **File**: `src/components/ReportCard.vue`
- **Description**: 
  - 统一的卡片样式
  - 标题 + 内容区域
  - 卡片圆角 24rpx
- **Acceptance Criteria Addressed**: N/A（组件）

## [ ] Task 3: 实现收支概览卡片
- **Priority**: P0
- **Depends On**: Task 2
- **File**: `src/pages/fire/report.vue`
- **Description**: 
  - 显示收入、支出、储蓄
  - 显示储蓄率
  - 收入绿色，支出红色
- **Acceptance Criteria Addressed**: AC-2

## [ ] Task 4: 实现净资产变动卡片
- **Priority**: P0
- **Depends On**: Task 2
- **File**: `src/pages/fire/report.vue`
- **Description**: 
  - 显示变化金额（+¥XXX 或 -¥XXX）
  - 显示上月余额 → 本月余额
  - 增加绿色，减少红色
- **Acceptance Criteria Addressed**: AC-3

## [ ] Task 5: 实现 FIRE 进度卡片
- **Priority**: P0
- **Depends On**: Task 2, F6 fire-progress
- **File**: `src/pages/fire/report.vue`
- **Description**: 
  - 显示进度条
  - 显示推进百分比
  - 显示距目标差额
- **Acceptance Criteria Addressed**: AC-4

## [ ] Task 6: 实现 Top 5 分类
- **Priority**: P0
- **Depends On**: Task 2
- **File**: `src/components/CategoryRanking.vue`, `src/pages/fire/report.vue`
- **Description**: 
  - 显示支出最多的5个分类
  - 显示金额和占比
  - 列表形式展示
- **Acceptance Criteria Addressed**: AC-5

## [ ] Task 7: 实现环比对比
- **Priority**: P1
- **Depends On**: Task 2
- **File**: `src/pages/fire/report.vue`
- **Description**: 
  - 显示支出变化（↑↓）
  - 显示储蓄率变化
  - 显示进度变化
- **Acceptance Criteria Addressed**: N/A（展示）

## [ ] Task 8: 实现分享功能
- **Priority**: P1
- **Depends On**: Task 1
- **File**: `src/utils/shareImage.ts`, `src/pages/fire/report.vue`
- **Description**: 
  - 使用 canvas 生成分享图片
  - 图片包含报告摘要
  - 支持保存和分享
- **Acceptance Criteria Addressed**: AC-6

## [ ] Task 9: 调用报告 API
- **Priority**: P0
- **Depends On**: Task 1
- **File**: `src/api/fire.ts`, `src/pages/fire/report.vue`
- **Description**: 
  - 创建 GET /api/fire/reports/:month 接口
  - 页面加载时调用
  - 支持手动触发生成
- **Acceptance Criteria Addressed**: N/A（数据）

## [ ] Task 10: 测试和修复
- **Priority**: P0
- **Depends On**: Task 1-9
- **File**: N/A
- **Description**: 
  - 全流程测试
  - 测试分享功能
  - 修复发现的问题
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3, AC-4, AC-5, AC-6
