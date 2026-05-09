# 记账模板 - 产品需求文档

## Overview
- **Summary**: 将常用的记账组合保存为模板，支持一键从模板记账，支持模板的增删改排序，入口在记账页右上角
- **Purpose**: 简化高频记账场景的操作步骤
- **Target Users**: 有固定记账习惯的用户

## Goals
- 记账页右上角显示"模板"按钮
- 模板列表页面支持按类型分组
- 模板包含：名称、类型、分类、金额、备注、账户
- 支持从模板快速记账
- 支持模板的增删改
- 支持模板排序

## Non-Goals (Out of Scope)
- 不实现模板分享功能
- 不实现模板导入导出
- 不实现模板分类管理

## Background & Context
高频记账场景（如每周五去同一家餐厅吃饭，消费大约200元）需要用户每次重复输入相同信息。模板功能可以一键保存这些组合，下次直接使用。

### 模板字段
| 字段 | 类型 | 说明 |
|------|------|------|
| name | string | 模板名称 |
| type | string | 支出/收入/转账 |
| categoryId | string | 分类ID |
| amount | string | 金额（可选） |
| remark | string | 备注（可选） |
| accountId | string | 账户ID（可选） |

## Functional Requirements
- **FR-1**: 记账页右上角显示"模板"按钮
- **FR-2**: 点击按钮弹出模板列表页面
- **FR-3**: 模板按类型分组显示（支出/收入/转账）
- **FR-4**: 点击模板自动填充表单
- **FR-5**: 创建/编辑模板表单
- **FR-6**: 删除模板
- **FR-7**: 模板排序

## Non-Functional Requirements
- **NFR-1**: 模板数量限制50个
- **NFR-2**: 模板数据缓存

## Constraints
- **Technical**: 使用模板 API
- **Business**: 模板存储在服务端
- **Dependencies**: 依赖分类选择、账户选择功能

## Assumptions
- 用户会创建常用模板
- 模板数量不会超过限制

## Acceptance Criteria

### AC-1: 模板按钮显示
- **Given**: 记账页
- **When**: 查看右上角
- **Then**: 显示"模板"按钮
- **Verification**: `human-judgment`

### AC-2: 模板列表显示
- **Given**: 点击模板按钮
- **When**: 查看列表
- **Then**: 按类型分组显示所有模板
- **Verification**: `human-judgment`

### AC-3: 从模板记账
- **Given**: 模板列表显示
- **When**: 点击某个模板
- **Then**: 填充表单数据，关闭列表
- **Verification**: `human-judgment`

### AC-4: 创建模板
- **Given**: 模板列表页
- **When**: 点击"新建模板"
- **Then**: 进入模板编辑表单
- **Verification**: `human-judgment`

### AC-5: 删除模板
- **Given**: 模板列表页
- **When**: 点击删除
- **Then**: 确认后删除模板
- **Verification**: `human-judgment`
