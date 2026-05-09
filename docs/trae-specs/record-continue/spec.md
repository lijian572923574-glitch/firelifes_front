# 继续记下一笔 - 产品需求文档

## Overview
- **Summary**: 记账成功后不跳转明细页，弹出"继续记一笔"确认卡片，3秒无操作自动跳转
- **Purpose**: 简化连续记账场景，减少用户反复进出的操作步骤
- **Target Users**: 所有记账用户，尤其适合连续记录多笔同类支出的场景

## Goals
- 记账成功后显示确认卡片，包含分类图标、金额和"记账成功"提示
- 卡片底部显示"继续记一笔"和"去明细页"两个按钮
- 3秒无操作自动跳转明细页
- 点击"继续记一笔"后清空金额和备注，保留分类选择

## Non-Goals (Out of Scope)
- 不修改现有的记账提交逻辑
- 不实现自动连记多笔的功能（仅支持手动连续记账）
- 不实现自定义倒计时时间

## Background & Context
当前记账流程：用户提交记账 → 跳转明细页 → 用户需重新进入记账页 → 选择分类 → 输入金额
优化后流程：用户提交记账 → 显示确认卡片 → 用户选择"继续记"或等待 → 快速进入下一笔

### 依赖关系
- 本功能依赖 `record-confirm-card` 组件
- `record-confirm-card` 组件需先于本功能实现

## Functional Requirements
- **FR-1**: 记账提交成功后显示 `RecordConfirmCard` 组件
- **FR-2**: 卡片显示当前记账的分类图标（大尺寸 96rpx）、分类名称、金额
- **FR-3**: 卡片底部显示两个按钮："继续记一笔"（主色）和"去明细页"（灰色）
- **FR-4**: 卡片显示后启动3秒倒计时，超时自动跳转明细页
- **FR-5**: 点击"继续记一笔"：清空金额输入框和备注输入框，关闭卡片，保持分类选择
- **FR-6**: 点击"去明细页"：立即关闭卡片，跳转 `pages/detail/index`
- **FR-7**: 卡片支持滑动关闭手势

## Non-Functional Requirements
- **NFR-1**: 卡片弹出动画流畅，无卡顿
- **NFR-2**: 倒计时使用 requestAnimationFrame，保证准确性
- **NFR-3**: App 被切后台时暂停倒计时，恢复前台继续计时

## Constraints
- **Technical**: 使用 Vue3 Composition API
- **Business**: 不影响现有业务逻辑
- **Dependencies**: 依赖 `record-confirm-card` 组件

## Assumptions
- 用户默认期望连续记账
- 3秒是合理的等待时间

## Acceptance Criteria

### AC-1: 记账成功后显示确认卡片
- **Given**: 用户完成一笔记账并提交
- **When**: 提交成功返回
- **Then**: 显示确认卡片，包含分类图标、金额、分类名称
- **Verification**: `human-judgment`

### AC-2: 卡片显示两个操作按钮
- **Given**: 确认卡片显示
- **When**: 查看卡片
- **Then**: 底部显示"继续记一笔"和"去明细页"两个按钮
- **Verification**: `human-judgment`

### AC-3: 3秒后自动跳转明细页
- **Given**: 确认卡片显示
- **When**: 3秒内无操作
- **Then**: 卡片消失，自动跳转明细页
- **Verification**: `automated`

### AC-4: 继续记账功能正常
- **Given**: 确认卡片显示
- **When**: 点击"继续记一笔"按钮
- **Then**: 关闭卡片，清空金额和备注，保留分类选择
- **Verification**: `human-judgment`

### AC-5: 跳转明细页功能正常
- **Given**: 确认卡片显示
- **When**: 点击"去明细页"按钮
- **Then**: 立即跳转明细页
- **Verification**: `human-judgment`

### AC-6: App 切后台暂停倒计时
- **Given**: 确认卡片显示，倒计时进行中
- **When**: App 被切到后台
- **Then**: 倒计时暂停
- **When**: App 切回前台
- **Then**: 倒计时继续
- **Verification**: `human-judgment`

## Open Questions
- [ ] 连续记账次数是否需要记录和展示？
- [ ] 是否需要声音反馈（记账成功提示音）？
