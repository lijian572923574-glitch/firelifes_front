# 投资账户追踪 - 产品需求文档

## Overview
- **Summary**: 投资账户追踪功能支持用户记录股票、基金等投资资产的持仓成本和当前市值，自动计算浮动盈亏和收益率。投资账户在资产总览中作为独立大类展示。
- **Purpose**: 帮助用户全面管理资产，包括投资类账户。
- **Target Users**: 有投资资产的记账用户

**注意**：此功能为 Phase 3 功能，数据结构在 Phase 1 已预留。

## Goals
- 支持创建投资账户（基金/股票/债券/其他）
- 支持记录持仓成本
- 支持更新当前市值
- 自动计算浮动盈亏和收益率
- 资产总览中汇总显示投资大类

## Non-Goals (Out of Scope)
- 不实现实时行情接入
- 不实现投资组合建议
- 不实现持仓历史追踪

## Background & Context
投资账户是资产类账户的扩展，支持记录持仓成本和当前市值。

### 盈亏计算
```
盈亏金额 = 当前市值 - 持仓成本
收益率 = 盈亏金额 / 持仓成本 × 100%
```

## Functional Requirements

- **FR-1**: 支持创建投资账户
- **FR-2**: 记录持仓成本
- **FR-3**: 支持更新当前市值
- **FR-4**: 自动计算盈亏
- **FR-5**: 资产总览汇总显示

## Non-Functional Requirements

- **NFR-1**: 盈亏颜色：盈利绿色，亏损红色
- **NFR-2**: 数据保留历史

## Constraints
- **Technical**: 使用已有的账户体系
- **Dependencies**: 依赖 F1 account-system

## Assumptions
- 用户有投资需求
- 用户可以手动更新市值

## Acceptance Criteria

### AC-1: 投资账户创建
- **Given**: 用户选择创建投资账户
- **When**: 填写信息并保存
- **Then**: 创建成功
- **Verification**: `human-judgment`

### AC-2: 盈亏计算正确
- **Given**: 市值 ¥68,000，成本 ¥50,000
- **When**: 计算盈亏
- **Then**: 盈亏金额 ¥18,000，收益率 36%
- **Verification**: `programmatic`

### AC-3: 市值更新
- **Given**: 投资账户
- **When**: 更新当前市值
- **Then**: 盈亏重新计算
- **Verification**: `human-judgment`

### AC-4: 资产总览汇总
- **Given**: 资产总览页
- **When**: 查看投资大类
- **Then**: 显示总投资市值和总盈亏
- **Verification**: `human-judgment`

## Open Questions
- [x] 不支持实时行情如何处理？ → 用户手动更新
- [x] 汇率如何处理？ → 默认人民币
