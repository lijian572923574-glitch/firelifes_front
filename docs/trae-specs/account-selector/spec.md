# 账户来源选择 - 产品需求文档（已重构）

## Overview
- **Summary**: 在记账页 Header 区域集成账户选择器，支持从已创建的账户列表中选择本次记账的支付账户。账户数据来自 F1 account-system 账户体系，是记账联动账户余额（F4）的关键入口。
- **Purpose**: 解决用户记账时无法指定支付账户的问题。
- **Target Users**: 所有记账用户

**更新说明**：此功能已从"记账标签"升级为账户体系的一等公民，支持完整的账户类型（资产类/负债类）、实时余额显示、以及与账户管理的联动。

## Goals
- Header 区域显示当前选择的账户（图标+名称+余额）
- 点击弹出账户列表弹窗
- 支持搜索账户
- 支持添加新账户
- 支持管理账户
- 无账户时显示引导

## Non-Goals (Out of Scope)
- 不实现账户别名
- 不实现账户分组（除资产/负债外）

## Background & Context
账户选择器是记账流程的关键入口，与账户体系（Phase 1）深度集成。

### 组件定位
```
AccountSelector
├── Header 显示区（当前选中账户）
├── 弹窗（账户列表）
│   ├── 搜索框
│   ├── 资产类账户
│   ├── 负债类账户
│   ├── 添加账户入口
│   └── 管理账户入口
└── 空状态（无账户时）
```

## Functional Requirements

- **FR-1**: Header 显示账户图标、名称、余额
- **FR-2**: 点击弹出账户列表弹窗
- **FR-3**: 账户列表按资产/负债分组
- **FR-4**: 支持搜索账户
- **FR-5**: 支持添加新账户
- **FR-6**: 支持管理账户
- **FR-7**: 无账户时显示引导

## Non-Functional Requirements

- **NFR-1**: 弹窗使用 slideUp + fadeIn 动画
- **NFR-2**: 选中状态使用 #E0F7FA 背景
- **NFR-3**: 账户余额缓存5分钟

## Constraints
- **Technical**: 使用 uni-app 组件
- **Dependencies**: 依赖 F1 account-system

## Assumptions
- 用户至少有一个账户
- 账户余额可正可负

## Acceptance Criteria

### AC-1: Header 显示账户
- **Given**: 记账页
- **When**: 已选择账户
- **Then**: 显示账户图标、名称、余额
- **Verification**: `human-judgment`

### AC-2: 弹窗显示账户列表
- **Given**: 记账页
- **When**: 点击账户选择器
- **Then**: 弹出账户列表，显示所有账户
- **Verification**: `human-judgment`

### AC-3: 账户信息正确显示
- **Given**: 账户列表
- **When**: 查看账户项
- **Then**: 显示图标、名称、余额，资产绿色，负债红色
- **Verification**: `human-judgment`

### AC-4: 搜索功能
- **Given**: 账户列表
- **When**: 输入搜索关键词
- **Then**: 过滤显示匹配的账户
- **Verification**: `human-judgment`

### AC-5: 添加新账户
- **Given**: 账户列表
- **When**: 点击添加新账户
- **Then**: 进入账户编辑页
- **Verification**: `human-judgment`

### AC-6: 无账户引导
- **Given**: 用户无账户
- **When**: 打开选择器
- **Then**: 显示空状态引导
- **Verification**: `human-judgment`

### AC-7: 记账必须选择账户
- **Given**: 记账页
- **When**: 未选择账户
- **Then**: 记账按钮禁用
- **Verification**: `human-judgment`

## Open Questions
- [x] 首次使用是否引导创建账户？ → 是
- [x] 账户排序规则？ → 按 order 字段排序
