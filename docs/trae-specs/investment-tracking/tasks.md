# 投资账户追踪 - 实施计划

## [ ] Task 1: 更新账户类型定义
- **Priority**: P0
- **Depends On**: F1 account-system
- **File**: `src/types/account.ts`
- **Description**: 
  - Account 接口添加 investmentType 字段
  - 添加 investmentType 类型
- **Acceptance Criteria Addressed**: FR-1

## [ ] Task 2: 更新账户编辑页
- **Priority**: P0
- **Depends On**: Task 1
- **File**: `src/pages/account/edit.vue`
- **Description**: 
  - 添加投资类型选择
  - 显示持仓成本输入
  - 显示当前市值输入
- **Acceptance Criteria Addressed**: FR-1, FR-2

## [ ] Task 3: 实现盈亏计算
- **Priority**: P0
- **Depends On**: Task 1
- **File**: `src/utils/investmentCalculator.ts`
- **Description**: 
  - 计算盈亏金额
  - 计算收益率
  - 格式化显示
- **Acceptance Criteria Addressed**: FR-4

## [ ] Task 4: 实现投资账户列表
- **Priority**: P0
- **Depends On**: Task 1
- **File**: `src/pages/investment/index.vue`
- **Description**: 
  - 显示所有投资账户
  - 显示总市值和总盈亏
  - 支持更新市值
- **Acceptance Criteria Addressed**: FR-3, FR-4

## [ ] Task 5: 实现更新市值弹窗
- **Priority**: P0
- **Depends On**: Task 3
- **File**: `src/components/UpdateValueModal.vue`, `src/pages/investment/index.vue`
- **Description**: 
  - 显示当前市值
  - 输入新市值
  - 实时计算盈亏变化
  - 确认更新
- **Acceptance Criteria Addressed**: FR-3

## [ ] Task 6: 更新资产总览
- **Priority**: P0
- **Depends On**: Task 1, Task 3
- **File**: `src/pages/assets/index.vue`
- **Description**: 
  - 投资账户作为单独大类
  - 汇总显示总投资市值
  - 汇总显示总盈亏
- **Acceptance Criteria Addressed**: FR-5

## [ ] Task 7: 调用投资相关 API
- **Priority**: P0
- **Depends On**: Task 1
- **File**: `src/api/account.ts`
- **Description**: 
  - 创建投资账户相关接口
  - 更新市值接口
- **Acceptance Criteria Addressed**: N/A（API）

## [ ] Task 8: 测试和修复
- **Priority**: P0
- **Depends On**: Task 1-7
- **File**: N/A
- **Description**: 
  - 全流程测试
  - 测试盈亏计算
  - 测试市值更新
  - 修复发现的问题
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3, AC-4
