# 金额千分位显示 - 产品需求文档

## Overview
- **Summary**: 金额输入区显示千分位格式（如 12,345.67），内部存储仍为纯数字字符串
- **Purpose**: 提升大金额的可读性，避免输入错误
- **Target Users**: 所有记账用户

## Goals
- 金额显示千分位格式
- 输入时实时格式化
- 提交时解析为纯数字
- 保持两位小数精度

## Non-Goals (Out of Scope)
- 不实现金额大写转换
- 不实现多币种支持
- 不实现金额语音播报

## Background & Context
当金额较大时（如 123456），用户难以快速识别金额大小。千分位格式（123,456）可以更直观地看到金额位数。

### 格式化规则
```
输入: 123456
显示: ¥ 123,456.00

输入: 123456.5
显示: ¥ 123,456.50

输入: 123456.78
显示: ¥ 123,456.78
```

## Functional Requirements
- **FR-1**: 金额显示千分位格式
- **FR-2**: 输入时实时格式化
- **FR-3**: 提交时解析为纯数字
- **FR-4**: 限制最大输入长度（12位整数+2位小数）

## Non-Functional Requirements
- **NFR-1**: 格式化响应及时（< 16ms）
- **NFR-2**: 使用等宽字体保证对齐

## Constraints
- **Technical**: 纯前端处理
- **Business**: 金额精度保持
- **Dependencies**: 无

## Assumptions
- 金额不超过合理范围
- 用户不会输入超长数字

## Acceptance Criteria

### AC-1: 千分位显示正确
- **Given**: 输入金额 123456
- **When**: 查看显示
- **Then**: 显示 ¥ 123,456.00
- **Verification**: `human-judgment`

### AC-2: 输入实时格式化
- **Given**: 输入金额
- **When**: 每输入一个数字
- **Then**: 实时更新显示格式
- **Verification**: `human-judgment`

### AC-3: 小数处理正确
- **Given**: 输入 123456.78
- **When**: 查看显示
- **Then**: 显示 ¥ 123,456.78
- **Verification**: `human-judgment`

### AC-4: 提交数据正确
- **Given**: 提交表单
- **When**: 查看提交数据
- **Then**: amount 为 "123456.78"（无千分位）
- **Verification**: `programmatic`
