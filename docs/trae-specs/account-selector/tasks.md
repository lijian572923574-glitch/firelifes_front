# 账户来源选择 - 实施计划（已重构）

## [ ] Task 1: 重写 AccountSelector 组件
- **Priority**: P0
- **Depends On**: F1 account-system
- **File**: `src/pages/record/components/AccountSelector.vue`
- **Description**: 
  - 重写整个组件
  - Header 显示区：图标 + 名称 + 余额
  - 弹窗区：账户列表 + 搜索 + 添加入口
  - 空状态：引导创建账户
- **Acceptance Criteria Addressed**: AC-1, AC-6

## [ ] Task 2: 实现 Header 显示区
- **Priority**: P0
- **Depends On**: Task 1
- **File**: `src/pages/record/components/AccountSelector.vue`
- **Description**: 
  - 显示账户图标（48rpx）
  - 显示账户名称
  - 显示余额（颜色根据类型）
  - 点击触发弹窗
- **Acceptance Criteria Addressed**: AC-1

## [ ] Task 3: 实现弹窗列表
- **Priority**: P0
- **Depends On**: Task 1
- **File**: `src/pages/record/components/AccountSelector.vue`
- **Description**: 
  - slideUp + fadeIn 动画
  - 按资产/负债分组
  - 账户项：图标 + 名称 + 余额
  - 选中态：#E0F7FA 背景
- **Acceptance Criteria Addressed**: AC-2, AC-3

## [ ] Task 4: 实现搜索功能
- **Priority**: P0
- **Depends On**: Task 3
- **File**: `src/pages/record/components/AccountSelector.vue`
- **Description**: 
  - 搜索框组件
  - 实时过滤
  - 高亮匹配文字
- **Acceptance Criteria Addressed**: AC-4

## [ ] Task 5: 实现添加入口
- **Priority**: P0
- **Depends On**: Task 3
- **File**: `src/pages/record/components/AccountSelector.vue`
- **Description**: 
  - "+ 添加新账户"按钮
  - 点击跳转账户编辑页
  - 添加成功后选中并关闭弹窗
- **Acceptance Criteria Addressed**: AC-5

## [ ] Task 6: 实现管理入口
- **Priority**: P0
- **Depends On**: Task 3
- **File**: `src/pages/record/components/AccountSelector.vue`
- **Description**: 
  - "管理账户"按钮
  - 点击跳转账户管理页
- **Acceptance Criteria Addressed**: N/A（导航）

## [ ] Task 7: 实现空状态引导
- **Priority**: P0
- **Depends On**: Task 1
- **File**: `src/pages/record/components/AccountSelector.vue`
- **Description**: 
  - 检测无账户
  - 显示引导卡片
  - "一键添加预设账户"按钮
  - "自定义添加账户"按钮
- **Acceptance Criteria Addressed**: AC-6

## [ ] Task 8: 集成到记账页
- **Priority**: P0
- **Depends On**: Task 1
- **File**: `src/pages/record/index.vue`
- **Description**: 
  - 集成 AccountSelector
  - 记账按钮根据是否选择账户禁用
  - 提交时传递 accountId
- **Acceptance Criteria Addressed**: AC-7

## [ ] Task 9: 测试和修复
- **Priority**: P0
- **Depends On**: Task 1-8
- **File**: N/A
- **Description**: 
  - 全流程测试
  - 测试各种状态
  - 修复发现的问题
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3, AC-4, AC-5, AC-6, AC-7
