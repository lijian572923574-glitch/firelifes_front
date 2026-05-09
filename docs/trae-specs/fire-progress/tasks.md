# FIRE进度面板 - 实施计划

## [ ] Task 1: 创建 FIRE 进度页面
- **Priority**: P0
- **Depends On**: None
- **File**: `src/pages/fire/progress.vue`
- **Description**: 
  - 创建 FIRE 进度页骨架
  - 定义页面布局：圆环区、指标区、储蓄率区、差额区
  - 集成 Loading 状态
- **Acceptance Criteria Addressed**: N/A（页面结构）

## [ ] Task 2: 实现圆环进度组件
- **Priority**: P0
- **Depends On**: Task 1
- **File**: `src/components/FireRingProgress.vue`
- **Description**: 
  - 使用 canvas 或 svg 绘制圆环
  - 圆环宽度 32rpx
  - 背景色 #E0F7FA，填充色 #00BFFF
  - stroke-dashoffset 动画（1.5s）
  - 中心显示百分比数字
  - 中心显示当前净资产
- **Acceptance Criteria Addressed**: AC-1, AC-2

## [ ] Task 3: 实现关键指标卡片
- **Priority**: P0
- **Depends On**: Task 1
- **File**: `src/components/FireMetrics.vue`, `src/pages/fire/progress.vue`
- **Description**: 
  - 三个卡片：净资产、月均支出、月均收入
  - 卡片宽度 1/3
  - 数字滚动动画
- **Acceptance Criteria Addressed**: AC-4

## [ ] Task 4: 实现储蓄率卡片
- **Priority**: P1
- **Depends On**: Task 1, F7 savings-rate
- **File**: `src/components/SavingsRateCard.vue`, `src/pages/fire/progress.vue`
- **Description**: 
  - 显示本月储蓄率和年度平均储蓄率
  - 显示趋势箭头
  - 颜色根据分级着色
- **Acceptance Criteria Addressed**: AC-5

## [ ] Task 5: 实现距目标差额显示
- **Priority**: P0
- **Depends On**: Task 1
- **File**: `src/pages/fire/progress.vue`
- **Description**: 
  - 显示还需多少金额
  - 大字号显示
  - 卡布里蓝色
- **Acceptance Criteria Addressed**: AC-6

## [ ] Task 6: 实现预计达成日期
- **Priority**: P0
- **Depends On**: Task 1
- **File**: `src/pages/fire/progress.vue`
- **Description**: 
  - 基于储蓄率和投资回报率计算
  - 显示预计年月
  - 如超出退休年龄则提示
- **Acceptance Criteria Addressed**: AC-3

## [ ] Task 7: 调用 FIRE 进度 API
- **Priority**: P0
- **Depends On**: Task 1
- **File**: `src/api/fire.ts`, `src/pages/fire/progress.vue`
- **Description**: 
  - 创建 GET /api/fire/progress 接口
  - 页面加载时调用
  - 更新组件数据
- **Acceptance Criteria Addressed**: N/A（数据加载）

## [ ] Task 8: 实现 FIRE 已达成状态
- **Priority**: P0
- **Depends On**: Task 2
- **File**: `src/pages/fire/progress.vue`
- **Description**: 
  - 判断当前净资产 >= 目标净资产
  - 显示"恭喜达成 FIRE！"提示
  - 圆环显示 100%
- **Acceptance Criteria Addressed**: AC-7

## [ ] Task 9: 实现调整目标入口
- **Priority**: P0
- **Depends On**: F5 fire-goal
- **File**: `src/pages/fire/progress.vue`
- **Description**: 
  - 页面底部添加"调整 FIRE 目标"按钮
  - 点击进入 FIRE 目标设定页
- **Acceptance Criteria Addressed**: AC-8

## [ ] Task 10: 测试和修复
- **Priority**: P0
- **Depends On**: Task 1-9
- **File**: N/A
- **Description**: 
  - 全流程测试
  - 测试 FIRE 已达成状态
  - 修复发现的问题
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3, AC-4, AC-5, AC-6, AC-7, AC-8
