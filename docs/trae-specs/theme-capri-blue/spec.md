# 主题色替换：卡布里蓝 (Capri Blue) - 产品需求文档

## Overview
- **Summary**: 将记账应用的全局主色从黄色系替换为卡布里蓝(#00BFFF)，统一设计风格
- **Purpose**: 区别于鲨鱼记账的黄色方案，建立独特的品牌识别度，提升视觉质感
- **Target Users**: 所有记账应用用户

## Goals
- 将所有页面的主色调从黄色(#FFD166)统一替换为卡布里蓝(#00BFFF)
- 将 TabBar 选中色从绿色(#3cc51f)替换为卡布里蓝
- 将所有相关的阴影、渐变、高亮色同步替换
- 保持业务逻辑不变，纯样式替换

## Non-Goals (Out of Scope)
- 不修改任何业务逻辑代码
- 不修改页面布局和交互流程
- 不替换 emoji 图标为线框图标（图标替换是另一个 spec）
- 不修改 Wot UI 组件库的默认主题变量
- 不处理 CustomTabbar 与原生 TabBar 的统一问题

## Background & Context
当前项目所有页面使用黄色(#FFD166)作为主色，与鲨鱼记账视觉风格雷同。用户决定采用小米SU7卡布里蓝作为新主色，灵感来自意大利卡布里岛蓝洞——色相介于天蓝与绿松石之间，带青调，高饱和度却不刺眼。

### 新色彩体系
| 用途 | 旧值 | 新值 |
|------|------|------|
| 主色 | #FFD166 (黄色) | #00BFFF (卡布里蓝) |
| 深色 | #FFC145 / #FFBB00 | #0099CC |
| 浅色背景 | — | #E0F7FA |
| 渐变 | linear-gradient(135deg, #FFD166, #FFC145) | linear-gradient(135deg, #00BFFF, #0099CC) |
| 阴影 | rgba(255, 209, 102, 0.3~0.4) | rgba(0, 191, 255, 0.3~0.4) |
| 确认按钮文字 | #ffb347 (橙色) | #00BFFF |
| TabBar选中色 | #3cc51f (绿色) | #00BFFF |

## Functional Requirements
- **FR-1**: 记账页 Header 背景渐变和阴影替换为卡布里蓝
- **FR-2**: 分类选择器选中态、分组下划线替换为卡布里蓝
- **FR-3**: 金额表单完成按钮替换为卡布里蓝渐变
- **FR-4**: 日期选择器确认文字替换为卡布里蓝
- **FR-5**: 明细首页 Header 背景渐变替换为卡布里蓝
- **FR-6**: pages.json TabBar selectedColor 替换为 #00BFFF
- **FR-7**: CustomTabbar.vue 选中文字色替换为 #00BFFF

## Non-Functional Requirements
- **NFR-1**: 所有色值替换必须精确，不允许出现遗漏的旧色值
- **NFR-2**: 替换后不影响文字可读性（深色文字在蓝色背景上仍需清晰）
- **NFR-3**: 渐变方向保持 135deg 不变

## Constraints
- **Technical**: 仅修改 CSS/SCSS 中的色值，不修改 template 和 script 逻辑
- **Business**: 支出红(#FA3534)和收入绿(#19BE6B)不变
- **Dependencies**: 无需新增依赖

## Assumptions
- 当前黄色系色值仅用于主色调，不用于其他语义（如警告色）
- TabBar 图标替换不在本 spec 范围内

## Acceptance Criteria

### AC-1: 记账页主题色替换
- **Given**: 用户打开记账页面
- **When**: 查看 Header 区域
- **Then**: Header 背景为卡布里蓝渐变(#00BFFF → #0099CC)，阴影为 rgba(0,191,255,0.3)
- **Verification**: `human-judgment`

### AC-2: 分类选择器选中态
- **Given**: 用户在记账页选择某个分类
- **When**: 分类图标被选中
- **Then**: 选中图标背景为卡布里蓝渐变，阴影为 rgba(0,191,255,0.3)，分组标题下划线为 #00BFFF
- **Verification**: `human-judgment`

### AC-3: 金额表单完成按钮
- **Given**: 用户弹出金额输入表单
- **When**: 查看键盘右下角完成按钮
- **Then**: 完成按钮为卡布里蓝渐变(#00BFFF → #0099CC)，阴影为 rgba(0,191,255,0.4)
- **Verification**: `human-judgment`

### AC-4: 日期选择器确认按钮
- **Given**: 用户弹出日期选择器
- **When**: 查看右上角确认按钮
- **Then**: 确认文字颜色为 #00BFFF
- **Verification**: `human-judgment`

### AC-5: 明细首页 Header
- **Given**: 用户打开明细首页
- **When**: 查看 Header 区域
- **Then**: Header 背景为卡布里蓝渐变(#00BFFF → #0099CC)
- **Verification**: `human-judgment`

### AC-6: TabBar 选中色
- **Given**: 用户在任意 Tab 页面
- **When**: 查看底部 TabBar
- **Then**: 选中 Tab 的文字/图标颜色为 #00BFFF
- **Verification**: `human-judgment`

### AC-7: 无残留旧色值
- **Given**: 主题色替换完成
- **When**: 全局搜索 #FFD166、#FFC145、#FFBB00、#ffb347、#3cc51f
- **Then**: 这些色值不再出现在项目源码中（node_modules 除外）
- **Verification**: `programmatic`

## Open Questions
- [ ] 取消按钮的白色半透明背景是否需要调整以适配蓝色 Header？
- [ ] 记账页页面背景 `#faf9f6 → #f5f3ef` 是否需要改为纯白？
