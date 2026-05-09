# FIRE时间换算 - 产品需求文档

## Overview
- **Summary**: FIRE 时间换算将每笔支出换算为等价的 FIRE 天数，让用户直观感受消费与财务自由之间的距离。不是让你别花钱，是让你有感知地花钱。
- **Purpose**: 帮助用户建立消费与 FIRE 目标之间的感知，理性消费。
- **Target Users**: 有 FIRE 目标的记账用户

## Goals
- 在记账确认卡片显示 FIRE 时间换算
- 在明细列表每笔支出右侧显示 FIRE 天数
- 支持开关设置（用户可关闭）
- 退款时显示负 FIRE 天数

## Non-Goals (Out of Scope)
- 不实现消费预警
- 不实现消费限制

## Background & Context
FIRE 时间换算是"FIRE可期"功能的延伸，帮助用户在消费时建立直观感受。

### 计算公式
```
日均 FIRE 目标支出 = 目标年支出 ÷ 365
FIRE 天数 = 支出金额 ÷ 日均 FIRE 目标支出
```

### 显示格式
- < 1 天：显示小时（如 6 小时）
- < 7 天：显示天（如 2.5 天）
- < 30 天：显示周（如 2 周）
- ≥ 30 天：显示月（如 2.5 月）

## Functional Requirements

- **FR-1**: 记账确认卡片显示 FIRE 时间
- **FR-2**: 明细列表支出项显示 FIRE 天数
- **FR-3**: 支持开关设置
- **FR-4**: 退款显示负 FIRE 天数

## Non-Functional Requirements

- **NFR-1**: FIRE 时间实时计算
- **NFR-2**: 关闭后完全不显示

## Constraints
- **Technical**: 前端计算
- **Dependencies**: 依赖 F5 fire-goal

## Assumptions
- 用户已设定 FIRE 目标
- 目标月支出 > 0

## Acceptance Criteria

### AC-1: 记账确认卡片显示
- **Given**: 记账成功
- **When**: 查看确认卡片
- **Then**: 显示"这笔消费 ≈ X 天 FIRE 时间"
- **Verification**: `human-judgment`

### AC-2: FIRE 天数计算正确
- **Given**: 支出 ¥35，目标月支出 ¥2,100
- **When**: 计算 FIRE 天数
- **Then**: ¥35 ÷ (¥2,100 × 12 ÷ 365) ≈ 0.51 天
- **Verification**: `programmatic`

### AC-3: 明细列表显示
- **Given**: 明细页
- **When**: 查看支出记录
- **Then**: 每笔支出右侧显示 FIRE 天数
- **Verification**: `human-judgment`

### AC-4: 开关设置生效
- **Given**: 用户关闭 FIRE 时间显示
- **When**: 记账或查看明细
- **Then**: 不显示 FIRE 时间
- **Verification**: `human-judgment`

### AC-5: 退款显示负数
- **Given**: 退款 ¥35
- **When**: 查看 FIRE 天数
- **Then**: 显示 -0.51 天
- **Verification**: `human-judgment`

## Open Questions
- [x] 未设定 FIRE 目标如何处理？ → 不显示 FIRE 时间
- [x] 目标月支出为0如何处理？ → 不显示
