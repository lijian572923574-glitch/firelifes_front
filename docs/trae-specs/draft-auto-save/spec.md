# 草稿暂存 - 产品需求文档

## Overview
- **Summary**: 记账中途退出时自动暂存当前状态，下次进入自动恢复，24小时过期
- **Purpose**: 防止用户意外退出时丢失输入内容
- **Target Users**: 所有记账用户

## Goals
- 退出记账页时自动保存草稿
- 重新进入时显示恢复提示
- 支持恢复草稿
- 支持放弃草稿
- 24小时自动过期

## Non-Goals (Out of Scope)
- 不实现草稿同步到服务器
- 不实现草稿手动保存
- 不实现草稿列表管理

## Background & Context
用户正在输入一笔复杂记账记录时，可能因为回复消息、接电话等原因意外退出记账页。草稿暂存功能可以保护用户的输入内容。

### 暂存内容
| 字段 | 说明 |
|------|------|
| type | 支出/收入/转账 |
| categoryId | 分类ID |
| amount | 金额 |
| remark | 备注 |
| accountId | 账户ID |
| fromAccountId | 转出账户 |
| toAccountId | 转入账户 |
| date | 日期 |
| savedAt | 保存时间 |

## Functional Requirements
- **FR-1**: 页面失焦/退出时保存草稿
- **FR-2**: 进入页面时检查草稿
- **FR-3**: 显示草稿恢复提示
- **FR-4**: 恢复草稿填充表单
- **FR-5**: 放弃草稿清空数据
- **FR-6**: 提交成功后清空草稿
- **FR-7**: 24小时自动过期

## Non-Functional Requirements
- **NFR-1**: 草稿存储在 localStorage
- **NFR-2**: 存储不影响页面性能

## Constraints
- **Technical**: 使用 localStorage
- **Business**: 仅本地存储
- **Dependencies**: 无

## Assumptions
- localStorage 可用
- 24小时过期时间合理

## Acceptance Criteria

### AC-1: 退出时自动保存
- **Given**: 用户在输入记账内容
- **When**: 退出记账页
- **Then**: 自动保存草稿
- **Verification**: `programmatic`

### AC-2: 进入时检查草稿
- **Given**: 草稿存在且未过期
- **When**: 进入记账页
- **Then**: 显示恢复提示
- **Verification**: `human-judgment`

### AC-3: 恢复草稿
- **Given**: 显示恢复提示
- **When**: 点击"恢复"
- **Then**: 填充表单数据
- **Verification**: `human-judgment`

### AC-4: 放弃草稿
- **Given**: 显示恢复提示
- **When**: 点击"放弃"
- **Then**: 清空草稿，正常显示
- **Verification**: `human-judgment`

### AC-5: 提交后清空
- **Given**: 提交成功
- **When**: 查看草稿
- **Then**: 草稿被清空
- **Verification**: `programmatic`

### AC-6: 过期自动清理
- **Given**: 草稿超过24小时
- **When**: 进入记账页
- **Then**: 不显示恢复提示
- **Verification**: `programmatic`
