# 记账成功确认卡片 - 产品需求文档

## Overview
- **Summary**: 记账成功后显示确认卡片，包含分类图标、金额、成功提示，支持滑动关闭，2秒后自动消失
- **Purpose**: 提供清晰的视觉反馈，确认记账操作已完成
- **Target Users**: 所有记账用户

## Goals
- 记账成功显示确认卡片
- 显示分类图标（大尺寸）、金额、分类名称
- 底部进度条显示2秒倒计时
- 支持滑动关闭
- 可作为 RecordConfirmCard 独立组件复用

## Non-Goals (Out of Scope)
- 不实现卡片内容的编辑功能
- 不实现卡片分享功能
- 不实现自定义卡片样式

## Background & Context
用户提交记账后需要明确知道操作是否成功。当前没有明确的成功反馈，用户需要跳转后才能确认。

### 组件职责
本组件是独立的 UI 组件，仅负责展示和交互，不处理业务逻辑。业务逻辑由调用方（如 `record-continue`）处理。

## Functional Requirements
- **FR-1**: 显示分类图标（大尺寸 96rpx）
- **FR-2**: 显示金额（根据类型显示颜色）
- **FR-3**: 显示分类名称
- **FR-4**: 显示"记账成功"文字
- **FR-5**: 底部显示进度条（2秒倒计时）
- **FR-6**: 支持 props 控制显示/隐藏
- **FR-7**: 支持滑动关闭手势

## Non-Functional Requirements
- **NFR-1**: 卡片弹出动画流畅
- **NFR-2**: 进度条使用 requestAnimationFrame
- **NFR-3**: App 切后台时暂停倒计时

## Constraints
- **Technical**: Vue3 + Composition API
- **Business**: 纯展示组件
- **Dependencies**: 无

## Assumptions
- 组件接收的 props 数据已校验
- 2秒是合理的自动消失时间

## Acceptance Criteria

### AC-1: 卡片正确显示内容
- **Given**: visible=true
- **When**: 组件渲染
- **Then**: 显示分类图标、金额、名称、成功提示
- **Verification**: `human-judgment`

### AC-2: 进度条正常
- **Given**: 卡片显示
- **When**: 2秒内
- **Then**: 进度条从100%→0%
- **Verification**: `human-judgment`

### AC-3: 关闭事件触发
- **Given**: visible=true
- **When**: 2秒后或滑动关闭
- **Then**: 触发 onClose 事件
- **Verification**: `programmatic`

### AC-4: Props 控制正常
- **Given**: visible=false
- **When**: 组件渲染
- **Then**: 卡片不显示
- **Verification**: `human-judgment`
