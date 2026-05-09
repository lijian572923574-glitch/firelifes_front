# 图标兜底修复 - 产品需求文档

## Overview
- **Summary**: 将 emoji 兜底图标替换为主色线框 SVG 图标，避免 emoji 在不同设备上显示不一致
- **Purpose**: 统一图标风格，提升视觉一致性
- **Target Users**: 所有记账用户

## Goals
- 创建 SVG 线框图标组件库
- 替换所有 emoji 兜底图标为 SVG
- 使用 #00BFFF 描边
- 保持线框风格统一

## Non-Goals (Out of Scope)
- 不替换正常的网络图标 URL
- 不实现图标动态下载
- 不实现图标主题色切换

## Background & Context
当前项目使用 emoji 作为兜底图标，但 emoji 在不同设备上显示不一致（大小、颜色、渲染效果），影响用户体验。统一使用 SVG 线框图标可以解决此问题。

### 图标映射
| 分类 | 原 emoji | SVG 组件 |
|------|----------|----------|
| 餐饮 | 🍜 | IconMeal |
| 交通 | 🚇 | IconTransport |
| 购物 | 🛒 | IconShopping |
| 娱乐 | 🎮 | IconGame |
| 通讯 | 📱 | IconPhone |
| 医疗 | 🏥 | IconHospital |
| 教育 | 📚 | IconBook |
| 工资 | 💰 | IconWallet |
| 其他 | 📦 | IconBox |

## Functional Requirements
- **FR-1**: 创建基础 SVG 图标组件
- **FR-2**: 创建各分类 SVG 图标
- **FR-3**: 图标组件支持 size 和 color props
- **FR-4**: 替换分类组件中的 emoji 兜底

## Non-Functional Requirements
- **NFR-1**: SVG 保持清晰（支持高 DPI）
- **NFR-2**: 图标加载无延迟

## Constraints
- **Technical**: SVG 内联
- **Business**: 统一主色描边
- **Dependencies**: 无

## Assumptions
- 图标数量有限
- SVG 内联性能可接受

## Acceptance Criteria

### AC-1: SVG 图标正确显示
- **Given**: 分类图标加载失败
- **When**: 查看兜底图标
- **Then**: 显示 SVG 线框图标
- **Verification**: `human-judgment`

### AC-2: 图标颜色统一
- **Given**: SVG 图标显示
- **When**: 查看图标
- **Then**: 描边颜色为 #00BFFF
- **Verification**: `human-judgment`

### AC-3: 尺寸可调
- **Given**: 图标组件
- **When**: 传入不同 size
- **Then**: 图标大小正确
- **Verification**: `human-judgment`
