# Tabbar 更新 - Product Requirement Document

## Overview
- **Summary**: 将现有记账应用的 tabbar 显示效果更新为用户提供图片中的样式
- **Purpose**: 统一设计风格，提升用户体验，匹配新的视觉设计
- **Target Users**: 所有记账应用用户

## Goals
- 更新 tabbar 的文本标签，匹配新设计
- 更新 tabbar 的图标显示
- 调整 tabbar 布局，移除中间突出的记账按钮设计，改为平铺显示
- 确保所有页面都能正常使用新的 tabbar

## Non-Goals (Out of Scope)
- 不修改 tabbar 的点击切换逻辑
- 不修改页面内容，只修改导航栏
- 不添加新功能页面

## Background & Context
- 当前 tabbar 有5个页面：明细、图表、记账、发现、我的
- 当前中间"记账"页面有突出显示的圆形按钮
- 用户希望更新为：明细、统计、记账、资产、我的
- 用户提供了新的设计图片，显示为平铺的5个 tab，没有突出效果

## Functional Requirements
- **FR-1**: 更新 tabbar 文本标签为：明细、统计、记账、资产、我的
- **FR-2**: 移除中间 tab 的突出显示效果，改为平铺布局
- **FR-3**: 所有页面保持 tabbar 导航可用
- **FR-4**: 更新 CustomTabbar 组件以匹配新设计

## Non-Functional Requirements
- **NFR-1**: 保持 tabbar 切换响应速度 <200ms
- **NFR-2**: 保持代码简洁易维护

## Constraints
- **Technical**: 使用 uni-app + Vue 3 + TypeScript
- **Business**: 保留现有页面路由不变
- **Dependencies**: 无需新的外部依赖

## Assumptions
- 用户会提供或我们可以创建新的图标资源
- 页面路由结构保持不变，只是修改标签和显示

## Acceptance Criteria

### AC-1: Tabbar 文本标签更新
- **Given**: 用户打开应用
- **When**: 查看底部导航栏
- **Then**: 显示的标签依次为：明细、统计、记账、资产、我的
- **Verification**: `human-judgment`

### AC-2: 中间 tab 平铺显示
- **Given**: 用户查看底部导航栏
- **When**: 所有 tab 都可见
- **Then**: 5个 tab 平铺显示，没有突出的圆形按钮
- **Verification**: `human-judgment`

### AC-3: Tabbar 切换正常
- **Given**: 用户点击任意 tab
- **When**: 切换到对应页面
- **Then**: 页面正确切换，选中状态正确显示
- **Verification**: `programmatic`

### AC-4: 所有页面都有 tabbar
- **Given**: 用户访问任意 tab 页面
- **When**: 查看页面底部
- **Then**: 都能看到 tabbar，并且当前页面正确高亮
- **Verification**: `human-judgment`

## Open Questions
- [ ] 新的图标资源是否需要用户提供？
- [ ] "资产"页面对应现有哪个页面？(当前有 analysis/index.vue，是否需要重命名或调整？)
