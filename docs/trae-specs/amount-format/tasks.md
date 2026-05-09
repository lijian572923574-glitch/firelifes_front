# 金额千分位显示 - 实施计划

## [ ] Task 1: 创建金额格式化工具
- **Priority**: P0
- **Depends On**: None
- **File**: `src/utils/amount.ts`
- **Description**: 
  创建金额工具函数：
  - formatAmount() - 格式化金额（添加千分位）
  - parseAmount() - 解析金额（移除千分位）
  - validateAmount() - 验证金额格式
- **Acceptance Criteria Addressed**: FR-1, FR-3, FR-4
- **Test Requirements**:
  - `programmatic` TR-1.1: formatAmount() 输出正确
  - `programmatic` TR-1.2: parseAmount() 输出正确

## [ ] Task 2: 修改金额显示组件
- **Priority**: P0
- **Depends On**: Task 1
- **File**: `src/pages/record/components/TransactionForm.vue`
- **Description**: 
  修改金额显示：
  - 金额输入时实时格式化
  - 使用格式化函数显示
  - 保持输入框透明覆盖在显示区
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3
- **Test Requirements**:
  - `human-judgment` TR-2.1: 显示千分位正确
  - `human-judgment` TR-2.2: 输入实时格式化

## [ ] Task 3: 修改提交逻辑
- **Priority**: P0
- **Depends On**: Task 1
- **File**: `src/pages/record/index.vue`
- **Description**: 
  修改提交逻辑：
  - 提交前使用 parseAmount() 解析
  - 确保提交数据为纯数字
- **Acceptance Criteria Addressed**: AC-4
- **Test Requirements**:
  - `programmatic` TR-3.1: 提交数据无千分位

## [ ] Task 4: 测试和修复
- **Priority**: P0
- **Depends On**: Task 1, Task 2, Task 3
- **File**: N/A
- **Description**: 
  - 全流程测试
  - 修复发现的问题
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3, AC-4
- **Test Requirements**:
  - `human-judgment` TR-4.1: 完整流程测试
