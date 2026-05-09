# FIRE进度面板 - 产品需求文档

## Overview
- **Summary**: FIRE 进度面板以直观的圆环进度图展示用户当前净资产距离 FIRE 目标的完成度，同时显示预计达成日期、储蓄率趋势、三项关键指标等数据，帮助用户追踪 FIRE 进程。
- **Purpose**: 让用户直观看到自己距离 FIRE 目标的进度，增强信心和动力。
- **Target Users**: 有 FIRE 目标的记账用户

## Goals
- 显示圆环进度图（当前净资产/目标净资产）
- 显示完成百分比
- 显示预计达成日期
- 显示三项关键指标：净资产、月均支出、月均收入
- 显示储蓄率卡片
- 显示距目标差额

## Non-Goals (Out of Scope)
- 不实现 FIRE 达成庆祝页动画（仅简单提示）
- 不实现详细的资产配置建议

## Background & Context
FIRE 进度面板是三角飞轮"FIRE可期"的核心页面，展示用户财务自由进度。

### 预计达成日期计算
```
预计月数 = ln((目标净资产 × 回报率 + 月储蓄) / (当前净资产 × 回报率 + 月储蓄)) / ln(1 + 回报率)

简化公式（忽略投资回报）：
预计月数 = (目标净资产 - 当前净资产) / 月储蓄
```

## Functional Requirements

- **FR-1**: 显示圆环进度图，填充比例 = 当前净资产 / 目标净资产
- **FR-2**: 圆环中心显示完成百分比
- **FR-3**: 显示预计达成日期
- **FR-4**: 显示三项关键指标：净资产、月均支出、月均收入
- **FR-5**: 显示本月储蓄率和年度平均储蓄率
- **FR-6**: 显示距目标差额
- **FR-7**: 支持调整 FIRE 目标

## Non-Functional Requirements

- **NFR-1**: 圆环绘制使用动画（stroke-dashoffset）
- **NFR-2**: 数字使用滚动动画
- **NFR-3**: 已达成时显示庆祝提示

## Constraints
- **Technical**: 使用 canvas 或 svg 绘制圆环
- **Dependencies**: 依赖 F1 account-system、F5 fire-goal、F7 savings-rate

## Assumptions
- 用户已设定 FIRE 目标
- 用户已有记账数据

## Acceptance Criteria

### AC-1: 圆环进度图显示
- **Given**: 进入 FIRE 进度页
- **When**: 页面加载完成
- **Then**: 显示圆环进度图，中心显示百分比
- **Verification**: `human-judgment`

### AC-2: 进度完成度计算
- **Given**: 有 FIRE 目标和净资产数据
- **When**: 查看圆环
- **Then**: 完成度 = 当前净资产 / 目标净资产 × 100%
- **Verification**: `programmatic`

### AC-3: 预计达成日期
- **Given**: 进度页
- **When**: 查看达成日期区域
- **Then**: 显示预计达成年月
- **Verification**: `human-judgment`

### AC-4: 关键指标显示
- **Given**: 进度页
- **When**: 查看指标卡片
- **Then**: 显示净资产、月均支出、月均收入
- **Verification**: `human-judgment`

### AC-5: 储蓄率显示
- **Given**: 进度页
- **When**: 查看储蓄率卡片
- **Then**: 显示本月储蓄率和年度平均储蓄率
- **Verification**: `human-judgment`

### AC-6: 距目标差额
- **Given**: 进度页
- **When**: 查看差额区域
- **Then**: 显示还需多少金额
- **Verification**: `human-judgment`

### AC-7: FIRE 已达成
- **Given**: 当前净资产 >= 目标净资产
- **When**: 查看进度页
- **Then**: 显示"恭喜达成 FIRE！"
- **Verification**: `human-judgment`

### AC-8: 调整目标入口
- **Given**: 进度页
- **When**: 点击调整目标
- **Then**: 进入 FIRE 目标设定页
- **Verification**: `human-judgment`

## Open Questions
- [x] 预计达成日期如何计算？ → 基于储蓄率和投资回报率
- [x] 未设定目标时如何显示？ → 显示引导
