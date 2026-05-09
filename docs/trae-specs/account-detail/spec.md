# 账户详情页 - 产品需求文档

## Overview
- **Summary**: 账户详情页展示单个账户的完整信息，包括当前余额、余额变动历史、以及对账功能。用户可以查看该账户的所有记账记录，并支持手动调整余额进行对账。
- **Purpose**: 让用户深入了解单个账户的收支明细，并支持对账调整。
- **Target Users**: 所有记账用户

## Goals
- 显示账户基本信息（图标、名称、余额）
- 显示本月收支汇总
- 显示余额变动历史（该账户的记账记录）
- 支持手动调整余额（对账）
- 支持账户编辑和删除

## Non-Goals (Out of Scope)
- 不实现账户的批量操作
- 不实现多币种显示

## Background & Context
账户详情页是账户体系的延伸，提供账户级别的数据视图。用户可以从资产总览页点击账户卡片进入。

## Functional Requirements

- **FR-1**: 显示账户基本信息（图标、名称、当前余额）
- **FR-2**: 显示本月收支汇总（收入、支出）
- **FR-3**: 显示余额变动记录，按日期分组
- **FR-4**: 支持手动调整余额，输入调整金额和原因
- **FR-5**: 支持进入编辑页修改账户信息
- **FR-6**: 支持删除账户

## Non-Functional Requirements

- **NFR-1**: 余额变动列表分页加载
- **NFR-2**: 余额变化使用数字滚动动画
- **NFR-3**: 对账弹窗居中显示

## Constraints
- **Technical**: 使用 uni.request 调用后端 API
- **Dependencies**: 依赖 F1 account-system

## Assumptions
- 账户存在且未被删除
- 用户有对账需求

## Acceptance Criteria

### AC-1: 账户基本信息显示
- **Given**: 进入账户详情页
- **When**: 页面加载完成
- **Then**: 显示账户图标、名称、当前余额
- **Verification**: `human-judgment`

### AC-2: 本月收支汇总
- **Given**: 账户详情页
- **When**: 查看余额下方
- **Then**: 显示本月收入和本月支出
- **Verification**: `human-judgment`

### AC-3: 余额变动列表
- **Given**: 账户详情页
- **When**: 查看余额变动区域
- **Then**: 显示变动记录列表，按日期分组，显示金额和说明
- **Verification**: `human-judgment`

### AC-4: 对账功能
- **Given**: 点击"对账"按钮
- **When**: 输入调整金额和原因并确认
- **Then**: 生成调整记录，更新账户余额
- **Verification**: `programmatic`

### AC-5: 账户编辑
- **Given**: 点击右上角"编辑"
- **When**: 修改账户信息并保存
- **Then**: 账户信息更新
- **Verification**: `human-judgment`

### AC-6: 账户删除
- **Given**: 点击"..." → 删除
- **When**: 确认删除
- **Then**: 账户删除，返回上一页
- **Verification**: `human-judgment`

## Open Questions
- [x] 余额变动记录是否需要分页？ → 是，支持分页
- [x] 调整余额是否需要审核？ → 不需要，直接生效
