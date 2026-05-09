# 快捷金额 - 产品需求文档

## Overview
- **Summary**: 在金额输入区上方显示常用金额标签，根据该分类的历史金额智能推荐，点击可直接填入金额
- **Purpose**: 减少用户输入金额的操作次数，提升记账效率
- **Target Users**: 有固定金额消费习惯的用户

## Goals
- 金额输入区上方显示快捷金额标签
- 根据当前分类智能推荐3个常用金额
- 点击标签直接填入金额
- 无历史数据时显示通用推荐

## Non-Goals (Out of Scope)
- 不实现自定义快捷金额
- 不实现快捷金额排序调整
- 不实现金额标签编辑

## Background & Context
用户对某些分类的金额比较固定（如咖啡 28 元、早餐 15 元），每次都需要手动输入数字键盘。快捷金额功能可以一键填入常用金额。

### 推荐规则
1. 按分类过滤：只统计当前分类的历史金额
2. 按使用频次排序：次数越多排名越前
3. 取前3个作为推荐

## Functional Requirements
- **FR-1**: 金额输入区上方显示快捷金额区
- **FR-2**: 显示3个推荐金额标签
- **FR-3**: 点击标签填入金额
- **FR-4**: 分类切换时更新推荐
- **FR-5**: 无历史数据显示通用推荐 [¥10] [¥50] [¥100]

## Non-Functional Requirements
- **NFR-1**: 缓存30分钟
- **NFR-2**: 点击反馈明显

## Constraints
- **Technical**: 使用金额推荐 API
- **Business**: 数据存储在服务端
- **Dependencies**: 依赖分类选择

## Assumptions
- 用户对某些金额有固定习惯
- 3个推荐足够

## Acceptance Criteria

### AC-1: 快捷金额区显示
- **Given**: 选择某个分类
- **When**: 查看金额输入区
- **Then**: 上方显示3个快捷金额标签
- **Verification**: `human-judgment`

### AC-2: 点击填入金额
- **Given**: 快捷金额标签显示
- **When**: 点击某个标签
- **Then**: 金额填入输入框
- **Verification**: `human-judgment`

### AC-3: 分类更新推荐
- **Given**: 切换分类
- **When**: 查看快捷金额
- **Then**: 更新为新分类的推荐金额
- **Verification**: `human-judgment`

### AC-4: 通用推荐
- **Given**: 新分类/无历史数据
- **When**: 查看快捷金额
- **Then**: 显示 [¥10] [¥50] [¥100]
- **Verification**: `human-judgment`
