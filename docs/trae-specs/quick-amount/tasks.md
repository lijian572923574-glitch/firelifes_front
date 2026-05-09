# 快捷金额 - 实施计划

## [ ] Task 1: 创建金额 API 模块
- **Priority**: P0
- **Depends On**: None
- **File**: `src/api/amount.ts`
- **Description**: 
  创建金额相关 API：
  - GET /api/amounts/suggestions - 获取金额推荐
- **Acceptance Criteria Addressed**: FR-2, FR-4
- **Test Requirements**:
  - `programmatic` TR-1.1: API 模块导出正确

## [ ] Task 2: 创建快捷金额组件
- **Priority**: P0
- **Depends On**: Task 1
- **File**: `src/pages/record/components/QuickAmount.vue`
- **Description**: 
  创建快捷金额组件：
  - 横向排列3个金额标签
  - 点击事件
  - 分类变化监听
  - 加载状态
  - 通用推荐兜底
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3, AC-4
- **Test Requirements**:
  - `human-judgment` TR-2.1: 组件正确显示
  - `human-judgment` TR-2.2: 点击功能正常
  - `human-judgment` TR-2.3: 分类更新正常

## [ ] Task 3: 集成到记账页
- **Priority**: P0
- **Depends On**: Task 2
- **File**: `src/pages/record/index.vue`
- **Description**: 
  集成快捷金额组件：
  - 在金额输入区上方添加组件
  - 传递当前分类 ID
  - 监听分类变化
- **Acceptance Criteria Addressed**: AC-1, AC-3
- **Test Requirements**:
  - `human-judgment` TR-3.1: 组件正常显示
  - `human-judgment` TR-3.2: 分类切换更新推荐

## [ ] Task 4: 实现缓存
- **Priority**: P1
- **Depends On**: Task 1
- **File**: `src/utils/amountCache.ts`
- **Description**: 
  实现缓存功能：
  - localStorage 存储
  - 30分钟过期
  - 缓存命中时直接使用
- **Acceptance Criteria Addressed**: NFR-1
- **Test Requirements**:
  - `programmatic` TR-4.1: 缓存正常工作

## [ ] Task 5: 测试和修复
- **Priority**: P0
- **Depends On**: Task 1, Task 2, Task 3
- **File**: N/A
- **Description**: 
  - 全流程测试
  - 修复发现的问题
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3, AC-4
- **Test Requirements**:
  - `human-judgment` TR-5.1: 完整流程测试
