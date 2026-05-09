# 账户详情页 - 实施计划

## [ ] Task 1: 创建账户详情页面
- **Priority**: P0
- **Depends On**: None
- **File**: `src/pages/account/detail.vue`
- **Description**: 
  - 创建账户详情页骨架
  - 定义页面布局：头部信息区、月度汇总区、变动列表区
  - 集成 Loading 状态
- **Acceptance Criteria Addressed**: AC-1, AC-2

## [ ] Task 2: 实现头部信息展示
- **Priority**: P0
- **Depends On**: Task 1
- **File**: `src/pages/account/detail.vue`
- **Description**: 
  - 显示账户图标（大尺寸 64rpx）
  - 显示账户名称
  - 显示当前余额（大字 56rpx）
  - 右上角编辑按钮
- **Acceptance Criteria Addressed**: AC-1

## [ ] Task 3: 实现月度收支汇总
- **Priority**: P0
- **Depends On**: Task 1
- **File**: `src/pages/account/detail.vue`
- **Description**: 
  - 显示本月收入和本月支出
  - 收入绿色，支出红色
  - 从 API 获取月度汇总数据
- **Acceptance Criteria Addressed**: AC-2

## [ ] Task 4: 实现余额变动列表
- **Priority**: P0
- **Depends On**: Task 1, F1 account-system
- **File**: `src/components/BalanceChangeItem.vue`, `src/pages/account/detail.vue`
- **Description**: 
  - 创建 BalanceChangeItem 组件
  - 显示变动类型、金额、说明、时间
  - 按日期分组（今天/昨天/MM月DD日）
  - 支持分页加载
- **Acceptance Criteria Addressed**: AC-3

## [ ] Task 5: 实现对账功能
- **Priority**: P0
- **Depends On**: Task 1
- **File**: `src/components/AdjustmentModal.vue`
- **Description**: 
  - 创建对账弹窗组件
  - 显示当前余额
  - 输入调整金额（正负）和原因
  - 验证原因必填
  - 确认后调用 API
- **Acceptance Criteria Addressed**: AC-4

## [ ] Task 6: 实现账户编辑入口
- **Priority**: P0
- **Depends On**: F1 account-system
- **File**: `src/pages/account/detail.vue`, `src/pages/account/edit.vue`
- **Description**: 
  - 右上角编辑按钮
  - 点击进入账户编辑页
  - 编辑后返回刷新
- **Acceptance Criteria Addressed**: AC-5

## [ ] Task 7: 实现账户删除功能
- **Priority**: P0
- **Depends On**: F1 account-system
- **File**: `src/pages/account/detail.vue`
- **Description**: 
  - 点击"..." → 删除
  - 二次确认弹窗
  - 显示关联记录数量
  - 删除后返回资产总览页
- **Acceptance Criteria Addressed**: AC-6

## [ ] Task 8: 测试和修复
- **Priority**: P0
- **Depends On**: Task 1-7
- **File**: N/A
- **Description**: 
  - 全流程测试
  - 修复发现的问题
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3, AC-4, AC-5, AC-6
