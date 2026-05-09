# 储蓄率追踪 - 产品需求文档

## Overview
- **Summary**: 储蓄率追踪功能帮助用户了解每月收入中真正存下来的比例。储蓄率 = (月收入 - 月支出) / 月收入，以可视化图表展示历史趋势，并用颜色分级提示储蓄健康状况。
- **Purpose**: 评估用户的财务健康状况，激励用户提高储蓄率。
- **Target Users**: 所有记账用户

## Goals
- 显示本月储蓄率
- 显示年度累计储蓄率
- 显示近12个月储蓄率趋势柱状图
- 显示月度明细列表
- 颜色分级提示（绿色/蓝色/橙色/红色）

## Non-Goals (Out of Scope)
- 不实现多年度对比
- 不实现自定义时间范围

## Background & Context
储蓄率是 FIRE 进程的关键指标。储蓄率越高，积累资产越快，FIRE 越早达成。

### 储蓄率颜色分级
| 储蓄率 | 颜色 | 含义 |
|--------|------|------|
| ≥ 50% | 绿色 | 非常健康 |
| 30%-50% | 蓝色 | 正常 |
| 10%-30% | 橙色 | 偏低 |
| < 10% | 红色 | 危险 |

## Functional Requirements

- **FR-1**: 显示本月储蓄率（进度条 + 百分比）
- **FR-2**: 显示年度累计储蓄率
- **FR-3**: 显示近12个月柱状图
- **FR-4**: 柱子颜色按分级着色
- **FR-5**: 显示月度明细列表
- **FR-6**: 明细页顶部显示本月储蓄率标签

## Non-Functional Requirements

- **NFR-1**: 柱状图使用动画加载
- **NFR-2**: 进度条使用动画
- **NFR-3**: 数字使用滚动动画

## Constraints
- **Technical**: 使用 echarts 或 uCharts
- **Dependencies**: 依赖记账数据

## Assumptions
- 用户已记账一段时间
- 收入和支出数据正确

## Acceptance Criteria

### AC-1: 本月储蓄率显示
- **Given**: 明细页
- **When**: 查看顶部
- **Then**: 显示本月储蓄率进度条和百分比
- **Verification**: `human-judgment`

### AC-2: 储蓄率计算正确
- **Given**: 有收支数据
- **When**: 计算储蓄率
- **Then**: 储蓄率 = (收入 - 支出) / 收入
- **Verification**: `programmatic`

### AC-3: 颜色分级正确
- **Given**: 储蓄率数据
- **When**: 查看颜色
- **Then**: ≥50% 绿色，30%-50% 蓝色，<30% 橙色，<0% 红色
- **Verification**: `human-judgment`

### AC-4: 趋势柱状图显示
- **Given**: 储蓄率趋势页
- **When**: 查看图表
- **Then**: 显示近12个月柱状图
- **Verification**: `human-judgment`

### AC-5: 年度累计显示
- **Given**: 储蓄率趋势页
- **When**: 查看年度累计区域
- **Then**: 显示已存金额和累计储蓄率
- **Verification**: `human-judgment`

## Open Questions
- [x] 储蓄率为负如何显示？ → 显示负数，使用红色
- [x] 无收入如何处理？ → 显示 "--"
