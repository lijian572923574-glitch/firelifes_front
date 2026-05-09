# 账户体系重构 - 实施计划

## [ ] Task 1: 更新账户数据结构
- **Priority**: P0
- **Depends On**: None
- **File**: `src/types/account.ts`
- **Description**: 
  - 新增 AssetAccountSubType: cash | investment | fixed | depreciating
  - 新增 LiabilityAccountSubType: credit_card | consumer_credit | mortgage | car_loan | loan
  - 更新 Account 接口，添加 subType 字段
  - 根据子类型添加特殊字段定义
- **Acceptance Criteria Addressed**: AC-1, AC-2
- **Test Requirements**: `unit-test` TR-1.1: 类型定义正确

## [ ] Task 2: 更新账户 API 接口
- **Priority**: P0
- **Depends On**: Task 1
- **File**: `src/api/account.ts`
- **Description**: 
  - 更新 GET /api/accounts 响应，添加各子类型汇总
  - 更新 POST /api/accounts，支持创建各子类型账户
  - 更新 PUT /api/accounts/:id，支持更新各子类型账户
  - 新增 PUT /api/accounts/:id/valuation，投资类市值更新
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3, AC-4, AC-5
- **Test Requirements**: `api-mock` TR-2.1: API 返回正确数据

## [ ] Task 3: 更新账户编辑页
- **Priority**: P0
- **Depends On**: Task 1, Task 2
- **File**: `src/pages/account/edit.vue`
- **Description**: 
  - 更新账户类型选择，4+5类展示
  - 根据 subType 动态显示不同字段
  - 折旧资产字段：品类、折旧方法、使用月数、残值
  - 固定资产字段：购入价、品类、关联负债
  - 信用卡字段：账单日、还款日
  - 房贷/车贷字段：贷款总额、期限、利率
- **Acceptance Criteria Addressed**: AC-1, AC-2
- **Test Requirements**: `human-judgment` TR-3.1: 表单字段正确显示

## [ ] Task 4: 更新账户列表页
- **Priority**: P0
- **Depends On**: Task 1, Task 2
- **File**: `src/pages/account/index.vue`
- **Description**: 
  - 按大类分组：资产类、负债类
  - 资产类下按子类型分组展示
  - 不同类型卡片显示不同信息
  - 投资类显示市值和收益率
  - 固定资产显示净权益
  - 折旧资产显示当前价值和折旧进度
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3, AC-4
- **Test Requirements**: `human-judgment` TR-4.1: 列表展示正确

## [ ] Task 5: 更新账户状态管理
- **Priority**: P0
- **Depends On**: Task 1, Task 2
- **File**: `src/store/modules/account.ts`
- **Description**: 
  - 更新 state 类型定义
  - 更新 getters：按子类型分组
  - 新增计算属性：cashTotal, investmentTotal, fixedTotal, depreciatingTotal
  - 新增计算属性：netAssets（净资产）
- **Acceptance Criteria Addressed**: AC-3, AC-4, AC-5
- **Test Requirements**: `unit-test` TR-5.1: 计算结果正确

## [ ] Task 6: 添加路由配置
- **Priority**: P0
- **Depends On**: Task 3, Task 4
- **File**: `src/router/index.ts`
- **Description**: 
  - 确认 /pages/account/index 路由
  - 确认 /pages/account/edit 路由
- **Acceptance Criteria Addressed**: None
- **Test Requirements**: `manual` TR-6.1: 路由跳转正常
