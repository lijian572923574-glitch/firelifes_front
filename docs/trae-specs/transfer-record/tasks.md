# 转账记账 - 实施计划

## [ ] Task 1: 创建转账 API 模块
- **Priority**: P0
- **Depends On**: None
- **File**: `src/api/transfer.ts`
- **Description**: 
  创建转账相关 API：
  - POST /api/records (type=transfer) - 创建转账记录
  - GET /api/accounts/:id/balance - 获取账户余额
- **Acceptance Criteria Addressed**: FR-5, FR-6, FR-7
- **Test Requirements**:
  - `programmatic` TR-1.1: API 模块导出正确

## [ ] Task 2: 创建 TypeTabs 组件
- **Priority**: P0
- **Depends On**: None
- **File**: `src/pages/record/components/TypeTabs.vue`
- **Description**: 
  创建 Tab 切换组件：
  - 三个 Tab：支出/收入/转账
  - 当前 Tab 高亮
  - 点击切换
- **Acceptance Criteria Addressed**: AC-1
- **Test Requirements**:
  - `human-judgment` TR-2.1: Tab 显示正确
  - `human-judgment` TR-2.2: 切换功能正常

## [ ] Task 3: 创建转账表单
- **Priority**: P0
- **Depends On**: Task 1, Task 2
- **File**: `src/pages/record/components/TransferForm.vue`
- **Description**: 
  创建转账表单组件：
  - 转出账户选择
  - 转入账户选择
  - 金额输入
  - 余额显示
  - 箭头图标
  - 同账户校验
  - 余额不足校验
- **Acceptance Criteria Addressed**: AC-2, AC-3, AC-4
- **Test Requirements**:
  - `human-judgment` TR-3.1: 表单显示正确
  - `human-judgment` TR-3.2: 账户选择功能正常
  - `human-judgment` TR-3.3: 余额显示正确
  - `human-judgment` TR-3.4: 同账户校验正常

## [ ] Task 4: 集成到记账页
- **Priority**: P0
- **Depends On**: Task 2, Task 3
- **File**: `src/pages/record/index.vue`
- **Description**: 
  集成转账功能：
  - Tab 组件
  - Tab 内容切换
  - 转账表单
  - 转账提交逻辑
- **Acceptance Criteria Addressed**: AC-1, AC-2
- **Test Requirements**:
  - `human-judgment` TR-4.1: Tab 切换正常
  - `human-judgment` TR-4.2: 转账提交正常

## [ ] Task 5: 测试和修复
- **Priority**: P0
- **Depends On**: Task 1, Task 2, Task 3, Task 4
- **File**: N/A
- **Description**: 
  - 全流程测试
  - 修复发现的问题
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3, AC-4, AC-5
- **Test Requirements**:
  - `human-judgment` TR-5.1: 完整流程测试
