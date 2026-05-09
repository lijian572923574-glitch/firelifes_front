# 定时自动记账 - 产品需求文档

## Overview
- **Summary**: 支持设置周期性自动记账（每天/每周/每月），到期自动创建记录并通知用户确认，VIP 功能
- **Purpose**: 解决固定周期收支需要手动重复记录的问题
- **Target Users**: 有固定收支（如房租、工资、定投）的用户

## Goals
- 创建自动记账模板（分类+金额+备注+账户+周期）
- 支持多种周期设置（每天/每周/每月/自定义）
- 到期自动创建待确认记录
- 推送通知用户确认
- VIP 功能标识

## Non-Goals (Out of Scope)
- 不实现自动扣款功能
- 不实现模板分享功能
- 不实现批量创建

## Background & Context
固定周期收支（如每月1号房租、每月5号工资）需要用户重复手动记录。自动记账模板可以记住这些设置，到期提醒用户确认即可。

### VIP 说明
- 本功能标记为 VIP 功能
- 前端 UI 完整实现
- 功能预留，后端可后续接入

## Functional Requirements
- **FR-1**: 显示 VIP 标识
- **FR-2**: 模板列表页面
- **FR-3**: 创建/编辑模板表单
- **FR-4**: 周期选择（每天/每周/每月/自定义）
- **FR-5**: 暂停/恢复模板
- **FR-6**: 删除模板

## Non-Functional Requirements
- **NFR-1**: VIP 提示友好
- **NFR-2**: 表单验证完整

## Constraints
- **Technical**: VIP 逻辑预留
- **Business**: VIP 用户才能使用
- **Dependencies**: 无

## Assumptions
- VIP 标识清晰
- 表单验证完善

## Acceptance Criteria

### AC-1: VIP 标识显示
- **Given**: 进入自动记账页面
- **When**: 查看页面
- **Then**: 显示 VIP 标识
- **Verification**: `human-judgment`

### AC-2: 模板列表显示
- **Given**: 进入自动记账页面
- **When**: 查看列表
- **Then**: 显示所有模板
- **Verification**: `human-judgment`

### AC-3: 创建模板表单
- **Given**: 点击创建模板
- **When**: 查看表单
- **Then**: 显示完整表单（类型/分类/金额/备注/账户/周期）
- **Verification**: `human-judgment`

### AC-4: 周期选择功能
- **Given**: 编辑模板
- **When**: 选择周期
- **Then**: 支持每天/每周/每月/自定义
- **Verification**: `human-judgment`

### AC-5: 暂停/恢复功能
- **Given**: 模板列表页
- **When**: 点击暂停/恢复
- **Then**: 模板状态切换
- **Verification**: `human-judgment`
