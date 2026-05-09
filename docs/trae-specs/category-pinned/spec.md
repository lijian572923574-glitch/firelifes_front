# 常用分类置顶 - 产品需求文档

## Overview
- **Summary**: 根据用户最近7天记账频率自动将常用分类置顶，最多置顶4个，显示"常用"标签
- **Purpose**: 减少用户查找常用分类的时间，提升记账效率
- **Target Users**: 所有记账用户，尤其适合高频使用固定分类的用户

## Goals
- 统计最近7天用户各分类的使用频次
- 使用频次最高的前4个分类置顶
- 置顶分类显示"常用"标签
- 新用户无历史数据时不显示置顶

## Non-Goals (Out of Scope)
- 不实现用户自定义置顶
- 不实现置顶分类数量调整
- 不实现分类使用趋势展示

## Background & Context
用户每次记账都需要滚动查找常用分类（如"餐饮"、"交通"），浪费时间。根据用户使用习惯自动置顶可以显著提升效率。

### 置顶规则
1. 统计周期：最近7天
2. 置顶数量：最多4个
3. 置顶范围：在各自所属分组内置顶
4. 排序方式：按使用频次降序

## Functional Requirements
- **FR-1**: 记账页加载时查询分类使用频次
- **FR-2**: 分类选择器根据频次调整排序
- **FR-3**: 置顶分类显示"常用"标签
- **FR-4**: 新用户/无历史数据时不显示置顶
- **FR-5**: 缓存1小时

## Non-Functional Requirements
- **NFR-1**: 缓存减少接口调用
- **NFR-2**: 异步加载不影响页面渲染

## Constraints
- **Technical**: 使用服务端统计数据
- **Business**: 数据存储在服务端
- **Dependencies**: 无

## Assumptions
- 用户使用频次稳定
- 7天是合理的统计周期

## Acceptance Criteria

### AC-1: 常用分类置顶显示
- **Given**: 用户有7天内记账记录
- **When**: 打开记账页
- **Then**: 常用分类显示在各自分组最前面
- **Verification**: `human-judgment`

### AC-2: 显示"常用"标签
- **Given**: 分类被置顶
- **When**: 查看分类项
- **Then**: 显示"常用"标签
- **Verification**: `human-judgment`

### AC-3: 新用户无置顶
- **Given**: 新用户（无历史记录）
- **When**: 打开记账页
- **Then**: 不显示置顶分类
- **Verification**: `human-judgment`

### AC-4: 最多4个置顶
- **Given**: 用户使用了多个分类
- **When**: 查看置顶分类
- **Then**: 最多显示4个置顶分类
- **Verification**: `human-judgment`
