# FIRE时间换算 - 实施计划

## [ ] Task 1: 创建 FIRE 时间计算工具
- **Priority**: P0
- **Depends On**: None
- **File**: `src/utils/fireTimeCalculator.ts`
- **Description**: 
  - 计算 FIRE 天数
  - 格式化显示（天/周/月）
  - 处理极端情况
- **Acceptance Criteria Addressed**: AC-2

## [ ] Task 2: 创建 FIRE 时间标签组件
- **Priority**: P0
- **Depends On**: Task 1
- **File**: `src/components/FireTimeBadge.vue`
- **Description**: 
  - 显示 FIRE 天数
  - 文字颜色 #00BFFF
  - 高度 32rpx
- **Acceptance Criteria Addressed**: AC-1, AC-3

## [ ] Task 3: 集成到记账确认卡片
- **Priority**: P0
- **Depends On**: Task 1, Task 2
- **File**: `src/components/RecordConfirmCard.vue`
- **Description**: 
  - 金额下方显示 FIRE 时间
  - 分隔线 + 说明文字
- **Acceptance Criteria Addressed**: AC-1

## [ ] Task 4: 集成到明细列表
- **Priority**: P0
- **Depends On**: Task 1, Task 2
- **File**: `src/pages/records/index.vue`
- **Description**: 
  - 每笔支出右侧显示 FIRE 天数
  - 仅支出显示，收入不显示
- **Acceptance Criteria Addressed**: AC-3

## [ ] Task 5: 实现开关设置
- **Priority**: P0
- **Depends On**: Task 3, Task 4
- **File**: `src/pages/settings.vue`
- **Description**: 
  - 添加 FIRE 时间开关
  - 本地存储设置
  - 关闭后完全不显示
- **Acceptance Criteria Addressed**: AC-4

## [ ] Task 6: 处理退款情况
- **Priority**: P0
- **Depends On**: Task 1
- **File**: `src/utils/fireTimeCalculator.ts`
- **Description**: 
  - 负数支出显示负 FIRE 天数
  - 退款时加回 FIRE 天数
- **Acceptance Criteria Addressed**: AC-5

## [ ] Task 7: 处理边界情况
- **Priority**: P1
- **Depends On**: Task 1
- **File**: `src/utils/fireTimeCalculator.ts`
- **Description**: 
  - 未设定目标：不计算
  - 目标月支出为0：不计算
  - 支出为0：显示 0 天
  - 极小金额：显示 "< 0.01 天"
  - 极大金额：显示月或年
- **Acceptance Criteria Addressed**: N/A（边界处理）

## [ ] Task 8: 测试和修复
- **Priority**: P0
- **Depends On**: Task 1-7
- **File**: N/A
- **Description**: 
  - 测试各种金额的计算
  - 测试开关设置
  - 测试退款情况
  - 修复发现的问题
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3, AC-4, AC-5
