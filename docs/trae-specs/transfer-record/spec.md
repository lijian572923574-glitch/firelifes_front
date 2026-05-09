# 转账记账 - 产品需求文档

## Overview
- **Summary**: 支持账户间转账记账，转账类型不计入收支，只影响账户余额，记账页增加"转账"Tab
- **Purpose**: 记录资金在账户间的流转，保持账户余额准确
- **Target Users**: 有多账户管理需求的用户

## Goals
- 记账页增加"转账"Tab
- 转账页面显示转出账户和转入账户
- 转账不影响收支统计
- 转账只影响账户余额
- 支持账户余额显示

## Non-Goals (Out of Scope)
- 不实现实时余额同步
- 不实现转账手续费记录
- 不实现预约转账

## Background & Context
用户需要记录资金在账户间的流转（如储蓄卡→微信、微信→信用卡还款）。这些操作不应计入收支统计，但需要更新账户余额。

### 转账 vs 收支的区别
| 场景 | 类型 | 计入收支 | 影响余额 |
|------|------|----------|----------|
| 购物 | 支出 | 是 | 转出账户- |
| 发工资 | 收入 | 是 | 转入账户+ |
| 卡转微信 | 转账 | 否 | 转出账户-，转入账户+ |

## Functional Requirements
- **FR-1**: 记账页显示三个 Tab（支出/收入/转账）
- **FR-2**: 转账 Tab 显示转出账户选择
- **FR-3**: 转账 Tab 显示转入账户选择
- **FR-4**: 显示两个账户的当前余额
- **FR-5**: 转账提交创建转账记录
- **FR-6**: 转账记录不计入收支统计
- **FR-7**: 转账更新两个账户的余额

## Non-Functional Requirements
- **NFR-1**: 转出/转入账户不能相同
- **NFR-2**: 转账金额不能超过转出账户余额（除非是信用卡）

## Constraints
- **Technical**: 使用转账 API
- **Business**: 转账存储在服务端
- **Dependencies**: 依赖账户功能

## Assumptions
- 用户有至少2个账户
- 信用卡可以透支

## Acceptance Criteria

### AC-1: Tab 显示正确
- **Given**: 记账页
- **When**: 查看 Tab
- **Then**: 显示"支出"、"收入"、"转账"三个 Tab
- **Verification**: `human-judgment`

### AC-2: 转账页面显示
- **Given**: 切换到转账 Tab
- **When**: 查看页面
- **Then**: 显示转出账户、转入账户、金额输入
- **Verification**: `human-judgment`

### AC-3: 账户余额显示
- **Given**: 转账页面
- **When**: 选择账户
- **Then**: 显示账户当前余额
- **Verification**: `human-judgment`

### AC-4: 同账户禁止
- **Given**: 转账页面
- **When**: 选择相同账户作为转出和转入
- **Then**: 提示错误，禁止提交
- **Verification**: `human-judgment`

### AC-5: 转账不影响收支
- **Given**: 完成一笔转账
- **When**: 查看收支统计
- **Then**: 转账记录不计入
- **Verification**: `programmatic`
