# 主题色替换：卡布里蓝 - 实施计划

## [ ] Task 1: 替换记账页 Header 主题色
- **Priority**: P0
- **Depends On**: None
- **File**: `src/pages/record/index.vue`
- **Description**: 
  - `.header` background: `linear-gradient(135deg, #ffd166 0%, #ffc145 100%)` → `linear-gradient(135deg, #00BFFF 0%, #0099CC 100%)`
  - `.header` box-shadow: `0 4rpx 20rpx rgba(255, 209, 102, 0.3)` → `0 4rpx 20rpx rgba(0, 191, 255, 0.3)`
- **Acceptance Criteria Addressed**: AC-1
- **Test Requirements**:
  - `human-judgement` TR-1.1: Header 背景显示为卡布里蓝渐变
  - `human-judgement` TR-1.2: Header 阴影为蓝色调

## [ ] Task 2: 替换分类选择器主题色
- **Priority**: P0
- **Depends On**: None
- **File**: `src/pages/record/components/CategorySelector.vue`
- **Description**: 
  - `.group-header` border-bottom: `2rpx solid #FFD166` → `2rpx solid #00BFFF`
  - `.category-item.selected .category-icon` background: `linear-gradient(135deg, #FFD166 0%, #FFC145 100%)` → `linear-gradient(135deg, #00BFFF 0%, #0099CC 100%)`
  - `.category-item.selected .category-icon` box-shadow: `0 4rpx 16rpx rgba(255, 209, 102, 0.3)` → `0 4rpx 16rpx rgba(0, 191, 255, 0.3)`
- **Acceptance Criteria Addressed**: AC-2
- **Test Requirements**:
  - `human-judgement` TR-2.1: 分组标题下划线为卡布里蓝
  - `human-judgement` TR-2.2: 选中分类图标背景为卡布里蓝渐变

## [ ] Task 3: 替换金额表单完成按钮主题色
- **Priority**: P0
- **Depends On**: None
- **File**: `src/pages/record/components/TransactionForm.vue`
- **Description**: 
  - `.key-item.confirm` background: `linear-gradient(135deg, #ffd166 0%, #ffc145 100%)` → `linear-gradient(135deg, #00BFFF 0%, #0099CC 100%)`
  - `.key-item.confirm` box-shadow: `0 6rpx 20rpx rgba(255, 209, 102, 0.4)` → `0 6rpx 20rpx rgba(0, 191, 255, 0.4)`
  - `.key-item.confirm:active` box-shadow: `0 4rpx 12rpx rgba(255, 209, 102, 0.3)` → `0 4rpx 12rpx rgba(0, 191, 255, 0.3)`
- **Acceptance Criteria Addressed**: AC-3
- **Test Requirements**:
  - `human-judgement` TR-3.1: 完成按钮为卡布里蓝渐变
  - `human-judgement` TR-3.2: 完成按钮阴影为蓝色调

## [ ] Task 4: 替换日期选择器确认按钮色
- **Priority**: P0
- **Depends On**: None
- **File**: `src/pages/record/components/DatePicker.vue`
- **Description**: 
  - `.picker-confirm` color: `#ffb347` → `#00BFFF`
  - `.picker-confirm:active` background: `rgba(255, 179, 71, 0.15)` → `rgba(0, 191, 255, 0.15)`
- **Acceptance Criteria Addressed**: AC-4
- **Test Requirements**:
  - `human-judgement` TR-4.1: 确认按钮文字为卡布里蓝

## [ ] Task 5: 替换明细首页 Header 主题色
- **Priority**: P0
- **Depends On**: None
- **File**: `src/pages/detail/index.vue`
- **Description**: 
  - `.header` background: `linear-gradient(135deg, #ffd166 0%, #ffbb00 100%)` → `linear-gradient(135deg, #00BFFF 0%, #0099CC 100%)`
  - `.picker-confirm` color: `#ffb347` → `#00BFFF`
  - `.picker-confirm:active` background: `rgba(255, 179, 71, 0.15)` → `rgba(0, 191, 255, 0.15)`
- **Acceptance Criteria Addressed**: AC-5, AC-4
- **Test Requirements**:
  - `human-judgement` TR-5.1: 明细首页 Header 为卡布里蓝渐变
  - `human-judgement` TR-5.2: 日期选择器确认色为卡布里蓝

## [ ] Task 6: 替换 TabBar 选中色
- **Priority**: P0
- **Depends On**: None
- **File**: `src/pages.json`
- **Description**: 
  - `tabBar.selectedColor`: `"#3cc51f"` → `"#00BFFF"`
- **Acceptance Criteria Addressed**: AC-6
- **Test Requirements**:
  - `human-judgement` TR-6.1: 原生 TabBar 选中文字为卡布里蓝

## [ ] Task 7: 替换自定义 TabBar 选中色
- **Priority**: P1
- **Depends On**: None
- **File**: `src/components/CustomTabbar.vue`
- **Description**: 
  - `.tab-text.active` color: `#3cc51f` → `#00BFFF`
- **Acceptance Criteria Addressed**: AC-6
- **Test Requirements**:
  - `human-judgement` TR-7.1: 自定义 TabBar 选中文字为卡布里蓝

## [ ] Task 8: 全局旧色值扫描验证
- **Priority**: P0
- **Depends On**: Task 1, Task 2, Task 3, Task 4, Task 5, Task 6, Task 7
- **Description**: 
  - 在 src/ 目录下搜索以下旧色值，确保无残留：
    - `#FFD166` / `#ffd166`
    - `#FFC145` / `#ffc145`
    - `#FFBB00` / `#ffbb00`
    - `#ffb347`
    - `#3cc51f`
  - 如发现残留，补充替换
- **Acceptance Criteria Addressed**: AC-7
- **Test Requirements**:
  - `programmatic` TR-8.1: grep 搜索上述色值，结果为空
