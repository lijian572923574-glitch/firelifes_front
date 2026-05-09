# 账户体系重构 - Trae Spec

## Overview
- **Summary**: 账户类型从2类扩展为4+5类，资产类包含现金类、投资类、固定资产、折旧资产；负债类包含信用卡、花呗白条、房贷、车贷、借款。每种类型有不同的数据结构、余额含义和管理方式。
- **Purpose**: 为资产总览、记账联动、FIRE规划提供准确的账户数据支持，支持净资产的精细化计算。
- **Target Users**: 所有记账用户

## Goals
- 账户类型从2类（资产/负债）扩展为4+5类
- 资产类：cash（现金类）、investment（投资类）、fixed（固定资产）、depreciating（折旧资产）
- 负债类：credit_card（信用卡）、consumer_credit（消费信贷）、mortgage（房贷）、car_loan（车贷）、loan（借款）
- 每种类型有不同的数据结构字段
- 折旧资产账户的余额 = 当前价值（自动计算）
- 固定资产账户的余额 = 净权益（估值 - 关联负债）
- 支持净资产的精确计算

## Non-Goals (Out of Scope)
- 不实现账户的批量导入/导出
- 不实现账户的多币种支持
- 不实现账户的合并/拆分

## Background & Context
原账户体系只有资产类和负债类两类，无法区分现金账户和投资账户，也无法支持固定资产和折旧资产的特殊管理需求。扩展后可以：
1. 投资类账户单独追踪市值和收益率
2. 固定资产账户关联负债计算净权益
3. 折旧资产账户自动计算当前价值

### 账户类型矩阵

| 大类 | 子类型 | 余额含义 | 特殊字段 |
|------|--------|---------|---------|
| asset | cash | 余额即价值 | - |
| asset | investment | 市值波动 | costBasis, marketValue |
| asset | fixed | 净权益 | purchasePrice, currentValue, linkedLiability |
| asset | depreciating | 当前价值 | purchasePrice, depreciationMethod, lifeMonths, residualValue |
| liability | credit_card | 已消费未还 | billDay, repayDay |
| liability | consumer_credit | 花呗/白条未还 | creditLimit, usedAmount |
| liability | mortgage | 剩余本金 | loanAmount, loanTermMonths |
| liability | car_loan | 剩余本金 | loanAmount, loanTermMonths |
| liability | loan | 借款本金 | lender, loanDate, dueDate |

## Functional Requirements

### FR-1: 账户列表页扩展
- 按大类分组：资产类、负债类
- 资产类下按子类型分组：现金类 → 投资类 → 固定资产 → 折旧资产
- 负债类下按子类型分组：信用卡/消费信贷 → 房贷/车贷 → 借款
- 每种类型的卡片显示不同信息

### FR-2: 账户编辑页扩展
- 选择大类后展示子类型选项
- 根据子类型动态显示不同字段
- 折旧资产额外字段：品类、折旧方法、计划使用月数、预期残值
- 固定资产额外字段：购入价、品类、关联负债账户

### FR-3: 净资产计算
```
净资产 = 现金类总额 + 投资类市值 + 固定资产净权益 + 折旧资产当前价值 - 负债总额

其中：
- 现金类总额 = SUM(cash账户余额)
- 投资类市值 = SUM(investment账户marketValue)
- 固定资产净权益 = SUM(fixed账户.currentValue - linkedLiabilityBalance)
- 折旧资产当前价值 = SUM(depreciating账户.currentValue)
- 负债总额 = SUM(所有负债账户余额)
```

### FR-4: 折旧资产账户余额自动计算
- 折旧资产账户余额 = 当前价值（由折旧算法计算）
- 每月1日自动更新折旧资产账户余额

### FR-5: 固定资产账户余额联动负债
- 固定资产账户可关联负债账户
- 固定资产账户余额 = 当前估值 - 关联负债余额
- 关联负债余额变化时自动更新固定资产账户余额

## Non-Functional Requirements
- **NFR-1**: 页面加载不超过 300ms
- **NFR-2**: 账户数据本地缓存，离线可查看
- **NFR-3**: 支持 UniApp 兼容（iOS/Android/小程序/H5）
- **NFR-4**: 遵循卡布里蓝色彩体系

## Constraints
- **Technical**: Vue3 + TypeScript + SCSS + Wot UI + UniApp
- **API**: RESTful 风格
- **Design**: 极简、纯白背景、SVG 线框图标

## Assumptions
- 后端支持多子类型账户的 CRUD API
- 折旧资产模块已实现自动折旧计算
- 固定资产模块已实现估值管理和负债关联

## Acceptance Criteria

### AC-1: 账户类型扩展
- **Given**: 用户进入账户编辑页
- **When**: 选择账户类型
- **Then**: 
  - 资产类下有4个子类型：现金类、投资类、固定资产、折旧资产
  - 负债类下有5个子类型：信用卡、花呗白条、房贷、车贷、借款
- **Verification**: `human-judgment`

### AC-2: 不同类型显示不同字段
- **Given**: 用户编辑不同类型的账户
- **When**: 查看表单字段
- **Then**: 
  - 现金类：名称、图标、初始余额
  - 投资类：名称、图标、初始余额、持仓成本、市值
  - 固定资产：名称、图标、购入价、品类、关联负债
  - 折旧资产：名称、图标、购入价、品类、折旧方法、使用月数、残值
- **Verification**: `human-judgment`

### AC-3: 折旧资产账户余额自动计算
- **Given**: 某折旧资产购入价¥500，计划24个月，残值¥50，已使用1个月
- **When**: 系统计算账户余额
- **Then**: 账户余额 = ¥481.25
- **Verification**: `unit-test`

### AC-4: 固定资产账户余额联动负债
- **Given**: 某固定资产当前估值¥2,000,000，关联房贷余额¥800,000
- **When**: 系统计算账户余额
- **Then**: 账户余额 = ¥1,200,000（净权益）
- **Verification**: `unit-test`

### AC-5: 净资产计算正确
- **Given**: 现金类¥20,000 + 投资类¥50,000 + 固定资产净权益¥1,200,000 + 折旧资产¥5,000 - 负债¥500,000
- **When**: 系统计算净资产
- **Then**: 净资产 = ¥775,000
- **Verification**: `unit-test`
