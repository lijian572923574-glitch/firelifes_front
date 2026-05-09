# 备注智能联想 - 产品需求文档

## Overview
- **Summary**: 输入备注时根据历史记录自动联想，同一分类下最近使用的备注优先展示，最多展示5条
- **Purpose**: 减少用户重复输入备注的操作，提升记账效率
- **Target Users**: 所有记账用户，尤其适合有固定消费习惯的用户

## Goals
- 备注输入时实时显示联想列表
- 优先显示同分类下的历史备注
- 最多显示5条联想结果
- 点击联想项自动填充

## Non-Goals (Out of Scope)
- 不实现跨分类的通用备注联想
- 不实现备注的自动分类
- 不实现备注的批量管理

## Background & Context
当前备注输入需要用户手动输入全部文字。对于高频备注（如"麦当劳"、"永和大王"等），用户希望能一键选择而非重复打字。

### 联想规则
1. 按分类过滤：优先显示当前分类下的备注
2. 按关键词匹配：模糊匹配用户输入
3. 按使用频次排序：次数越多排名越前
4. 按最近使用排序：相同频次时，最近使用的优先

## Functional Requirements
- **FR-1**: 备注输入框获取焦点后，监听输入事件
- **FR-2**: 输入≥1个字符后触发联想查询
- **FR-3**: 显示最多5条联想结果
- **FR-4**: 联想项包含匹配高亮
- **FR-5**: 点击联想项填充到输入框
- **FR-6**: 输入框失焦或提交后隐藏联想列表
- **FR-7**: 300ms 防抖处理

## Non-Functional Requirements
- **NFR-1**: 联想响应时间 < 200ms
- **NFR-2**: 本地缓存10分钟
- **NFR-3**: 特殊字符过滤处理

## Constraints
- **Technical**: 使用防抖优化查询频率
- **Business**: 备注存储在服务端
- **Dependencies**: 依赖 `category-pinned` 功能获取当前分类

## Assumptions
- 用户备注习惯稳定
- 网络延迟可接受

## Acceptance Criteria

### AC-1: 输入触发联想
- **Given**: 备注输入框
- **When**: 输入≥1个字符
- **Then**: 显示联想列表
- **Verification**: `human-judgment`

### AC-2: 联想结果正确
- **Given**: 触发联想
- **When**: 查看联想结果
- **Then**: 最多显示5条，按匹配度排序
- **Verification**: `human-judgment`

### AC-3: 点击填充
- **Given**: 联想列表显示
- **When**: 点击某个联想项
- **Then**: 填充到输入框，联想列表隐藏
- **Verification**: `human-judgment`

### AC-4: 分类优先
- **Given**: 当前选择了分类（如"餐饮"）
- **When**: 输入备注触发联想
- **Then**: 优先显示该分类下的历史备注
- **Verification**: `human-judgment`

### AC-5: 失焦隐藏
- **Given**: 联想列表显示
- **When**: 输入框失焦
- **Then**: 联想列表隐藏
- **Verification**: `human-judgment`
