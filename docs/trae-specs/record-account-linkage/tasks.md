# 记账联动账户余额 - 实施计划

## [ ] Task 1: 创建记入资产开关组件
- **Priority**: P0
- **Depends On**: None
- **File**: `src/pages/record/components/DepreciatingAssetSwitch.vue`
- **Description**: 
  - 组件 props: modelValue, purchasePrice, defaultCategory
  - 组件 emits: update:modelValue, change
  - 仅 type=expense 时渲染
  - 开关打开展开资产字段
  - 品类选择后自动推荐折旧方法
  - 显示月折旧估算
- **Acceptance Criteria Addressed**: AC-5, AC-6, AC-7, AC-8
- **Test Requirements**: `human-judgment` TR-1.1: 开关交互正确

## [ ] Task 2: 更新记账页集成记入资产
- **Priority**: P0
- **Depends On**: Task 1
- **File**: `src/pages/record/index.vue`
- **Description**: 
  - 记账类型为"支出"时显示记入资产开关
  - 开关打开时收集资产字段数据
  - 提交记账时同时调用创建折旧资产 API
- **Acceptance Criteria Addressed**: AC-5, AC-7, AC-8, AC-9
- **Test Requirements**: `integration-test` TR-2.1: 记账同时创建资产

## [ ] Task 3: 更新记账 API
- **Priority**: P0
- **Depends On**: None
- **File**: `src/api/record.ts`
- **Description**: 
  - POST /api/records 支持 createDepreciatingAsset 字段
  - PUT /api/records/:id 支持更新关联折旧资产
  - DELETE /api/records/:id 支持解关联折旧资产
- **Acceptance Criteria Addressed**: AC-9
- **Test Requirements**: `api-mock` TR-3.1: API 返回正确数据

## [ ] Task 4: 更新记账确认卡片
- **Priority**: P1
- **Depends On**: None
- **File**: `src/components/RecordConfirmCard.vue`
- **Description**: 
  - 显示关联账户名称
  - 显示 FIRE 时间换算
  - 显示更新后的账户余额
- **Acceptance Criteria Addressed**: None
- **Test Requirements**: `human-judgment` TR-4.1: 卡片展示正确

## [ ] Task 5: 更新明细页账户信息显示
- **Priority**: P0
- **Depends On**: None
- **File**: `src/pages/records/index.vue`
- **Description**: 
  - 显示账户图标和名称
  - 显示记账类型和金额
- **Acceptance Criteria Addressed**: None
- **Test Requirements**: `human-judgment` TR-5.1: 信息展示正确

## [ ] Task 6: 折旧资产卖出联动收入创建
- **Priority**: P0
- **Depends On**: None
- **File**: `src/api/assets/depreciating.ts`
- **Description**: 
  - PUT /api/assets/depreciating/:id/dispose
  - 处置方式为"卖出"时，返回 incomeRecordId
  - 后端自动创建收入记录
- **Acceptance Criteria Addressed**: AC-10
- **Test Requirements**: `integration-test` TR-6.1: 卖出自动创建收入

## [ ] Task 7: 账户状态管理更新
- **Priority**: P0
- **Depends On**: None
- **File**: `src/store/modules/account.ts`
- **Description**: 
  - 记账成功更新账户余额
  - 编辑/删除记账回滚账户余额
  - 支持折旧资产余额更新
- **Acceptance Criteria Addressed**: AC-2, AC-3, AC-4, AC-11, AC-12
- **Test Requirements**: `unit-test` TR-7.1: 状态管理正确
