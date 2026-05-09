# FIRE目标设定 - 产品需求文档

## Overview
- **Summary**: FIRE 目标设定允许用户定义自己的 FIRE（Financial Independence, Retire Early）财务自由目标，包括目标月支出、安全提现率、投资回报率等参数，系统自动计算需要积累的目标净资产。
- **Purpose**: 帮助用户设定清晰的 FIRE 目标，为 FIRE 进度追踪提供数据基础。
- **Target Users**: 有财务自由追求的记账用户

## Goals
- 支持设定目标月支出（支持自动计算）
- 支持设置安全提现率（1%-6%）
- 支持设置预期投资回报率（1%-12%）
- 支持设置退休年龄（30-70岁）
- 自动计算目标净资产
- 支持随时修改目标

## Non-Goals (Out of Scope)
- 不实现多目标（如旅行目标、买房目标）
- 不实现目标分解到每月
- 不实现投资组合建议

## Background & Context
FIRE（Financial Independence, Retire Early）是一种财务理念，通过积累足够覆盖生活支出的资产来实现财务自由。FIRE生活家 APP 帮助用户追踪 FIRE 进度。

### 核心公式
```
目标净资产 = 目标月支出 × 12 ÷ 安全提现率

例如：目标月支出 ¥5,000，安全提现率 4%
目标净资产 = ¥5,000 × 12 ÷ 0.04 = ¥1,500,000
```

## Functional Requirements

- **FR-1**: 显示 FIRE 目标设定表单
- **FR-2**: 目标月支出支持手动输入
- **FR-3**: 目标月支出支持自动计算（近3/6/12个月均值）
- **FR-4**: 安全提现率滑动选择（1%-6%）
- **FR-5**: 预期投资回报率滑动选择（1%-12%）
- **FR-6**: 退休年龄滑动选择（30-70岁）
- **FR-7**: 实时计算并显示目标净资产
- **FR-8**: 保存目标到服务端

## Non-Functional Requirements

- **NFR-1**: 滑块拖动实时响应
- **NFR-2**: 数字变化使用滚动动画
- **NFR-3**: 表单数据本地持久化（草稿）

## Constraints
- **Technical**: 使用 uni.request 调用后端 API
- **Dependencies**: 依赖记账数据（计算月均支出）

## Assumptions
- 用户有 FIRE 需求
- 用户已经记账一段时间

## Acceptance Criteria

### AC-1: 页面显示目标表单
- **Given**: 进入 FIRE 目标页
- **When**: 页面加载完成
- **Then**: 显示目标月支出、安全提现率、投资回报率、退休年龄表单
- **Verification**: `human-judgment`

### AC-2: 目标月支出输入
- **Given**: FIRE 目标页
- **When**: 输入目标月支出
- **Then**: 实时更新目标净资产预览
- **Verification**: `human-judgment`

### AC-3: 自动计算月均支出
- **Given**: FIRE 目标页
- **When**: 点击"自动计算"并选择周期
- **Then**: 填入对应周期的月均支出
- **Verification**: `programmatic`

### AC-4: 安全提现率选择
- **Given**: FIRE 目标页
- **When**: 拖动安全提现率滑块
- **Then**: 值在 1%-6% 范围变化，实时更新目标净资产
- **Verification**: `human-judgment`

### AC-5: 目标净资产计算
- **Given**: FIRE 目标页
- **When**: 填写或修改任意参数
- **Then**: 目标净资产 = 目标月支出 × 12 ÷ 安全提现率
- **Verification**: `programmatic`

### AC-6: 保存目标
- **Given**: 填写完 FIRE 目标
- **When**: 点击"保存目标"
- **Then**: 目标保存到服务端，返回成功
- **Verification**: `programmatic`

### AC-7: 空状态引导
- **Given**: 首次进入 FIRE 目标页
- **When**: 未设定目标
- **Then**: 显示引导卡片"还没设定 FIRE 目标？来算算你需要多少钱"
- **Verification**: `human-judgment`

## Open Questions
- [x] 是否需要验证目标是否可达？ → 不需要，仅计算
- [x] 目标是否需要审核？ → 不需要
