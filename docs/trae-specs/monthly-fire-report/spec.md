# 月度FIRE报告 - 产品需求文档

## Overview
- **Summary**: 月度 FIRE 报告自动生成上月财务总结，包括收支情况、净资产变动、FIRE 进度推进、距离目标变化等，并以精美的卡片式页面呈现，支持分享。
- **Purpose**: 每月给用户一个财务总结，增强成就感和动力。
- **Target Users**: 有 FIRE 目标的记账用户

## Goals
- 自动生成月度报告（每月1日）
- 支持手动触发生成
- 显示收支概览
- 显示净资产变动
- 显示 FIRE 进度
- 显示 Top 5 支出分类
- 显示与上月对比
- 支持分享

## Non-Goals (Out of Scope)
- 不实现年度报告
- 不实现报告导出 PDF
- 不实现报告订阅邮件

## Background & Context
月度报告是 FIRE 可期功能的高阶展示，帮助用户回顾和总结。

### 报告内容
- 收支概览：收入、支出、储蓄、储蓄率
- 净资产变化：上月余额、本月余额、变化金额
- FIRE 进度：完成度、推进百分比、距目标差额
- Top 5 分类：支出最多的5个分类
- 环比对比：本月 vs 上月

## Functional Requirements

- **FR-1**: 报告列表页
- **FR-2**: 报告详情页
- **FR-3**: 收支概览卡片
- **FR-4**: 净资产变化卡片
- **FR-5**: FIRE 进度卡片
- **FR-6**: Top 5 支出分类
- **FR-7**: 环比对比卡片
- **FR-8**: 分享功能

## Non-Functional Requirements

- **NFR-1**: 报告页面精美设计
- **NFR-2**: 卡片加载动画
- **NFR-3**: 分享图片生成

## Constraints
- **Technical**: 需要 canvas 生成分享图片
- **Dependencies**: 依赖 F1、F6、F7

## Assumptions
- 用户已使用一段时间
- 用户已设定 FIRE 目标

## Acceptance Criteria

### AC-1: 报告页面显示
- **Given**: 进入报告页
- **When**: 页面加载完成
- **Then**: 显示报告内容
- **Verification**: `human-judgment`

### AC-2: 收支卡片显示
- **Given**: 报告页
- **When**: 查看收支卡片
- **Then**: 显示收入、支出、储蓄、储蓄率
- **Verification**: `human-judgment`

### AC-3: 净资产变动显示
- **Given**: 报告页
- **When**: 查看净资产卡片
- **Then**: 显示上月余额、本月余额、变化金额
- **Verification**: `human-judgment`

### AC-4: FIRE 进度显示
- **Given**: 报告页
- **When**: 查看 FIRE 卡片
- **Then**: 显示完成度、推进百分比
- **Verification**: `human-judgment`

### AC-5: Top 5 分类显示
- **Given**: 报告页
- **When**: 查看分类区域
- **Then**: 显示支出最多的5个分类
- **Verification**: `human-judgment`

### AC-6: 分享功能
- **Given**: 点击分享按钮
- **When**: 生成分享图片
- **Then**: 图片包含报告摘要
- **Verification**: `human-judgment`

## Open Questions
- [x] 首次使用无对比数据如何显示？ → 显示"这是你的第一个月报告"
- [x] 报告生成失败如何处理？ → 显示重试按钮
