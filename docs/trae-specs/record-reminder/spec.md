# 记账提醒 - 产品需求文档

## Overview
- **Summary**: 支持设置每日固定时间提醒记账，支持多时间段设置，使用系统本地通知，设置入口在"我的"页面
- **Purpose**: 帮助用户养成记账习惯，避免遗漏
- **Target Users**: 容易忘记记账的用户

## Goals
- 设置入口在"我的"页面
- 支持开启/关闭提醒开关
- 支持添加多个提醒时间
- 支持设置提醒日期（每天/工作日/自定义）
- 到点推送本地通知
- 点击通知进入记账页

## Non-Goals (Out of Scope)
- 不实现声音/震动自定义
- 不实现农历提醒
- 不实现提醒历史记录

## Background & Context
用户经常忘记记账，尤其是小额支出。每日提醒可以帮助用户养成记账习惯。

### 提醒设置项
| 设置项 | 类型 | 说明 |
|--------|------|------|
| enabled | boolean | 总开关 |
| times | string[] | 提醒时间列表 |
| days | number[] | 提醒日期 |

## Functional Requirements
- **FR-1**: "我的"页面显示"记账提醒"入口
- **FR-2**: 提醒设置页面支持开关
- **FR-3**: 支持添加多个提醒时间
- **FR-4**: 支持设置提醒日期
- **FR-5**: 订阅系统本地通知
- **FR-6**: 点击通知进入记账页

## Non-Functional Requirements
- **NFR-1**: 通知权限自动检测
- **NFR-2**: 设置数据本地缓存

## Constraints
- **Technical**: 使用 uni-app push API
- **Business**: 依赖系统通知权限
- **Dependencies**: 无

## Assumptions
- 用户会授权通知权限
- App 正常运行

## Acceptance Criteria

### AC-1: 设置入口显示
- **Given**: 用户打开"我的"页面
- **When**: 查看设置区域
- **Then**: 显示"记账提醒"入口
- **Verification**: `human-judgment`

### AC-2: 提醒开关功能
- **Given**: 进入提醒设置页
- **When**: 开关切换
- **Then**: 订阅/取消订阅通知
- **Verification**: `human-judgment`

### AC-3: 多时间段支持
- **Given**: 提醒设置页
- **When**: 添加多个时间
- **Then**: 可以添加多个提醒时间
- **Verification**: `human-judgment`

### AC-4: 通知推送正常
- **Given**: 提醒时间到达
- **When**: App 在后台
- **Then**: 推送本地通知
- **Verification**: `human-judgment`

### AC-5: 点击通知跳转
- **Given**: 用户收到通知
- **When**: 点击通知
- **Then**: 打开 App 并进入记账页
- **Verification**: `human-judgment`
