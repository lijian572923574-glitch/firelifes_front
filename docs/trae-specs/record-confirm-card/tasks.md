# 记账成功确认卡片 - 实施计划

## [ ] Task 1: 创建 RecordConfirmCard 组件
- **Priority**: P0
- **Depends On**: None
- **File**: `src/components/RecordConfirmCard.vue`
- **Description**: 
  创建确认卡片组件：
  - Props: visible, categoryIcon, categoryName, amount, type
  - 显示分类图标（大尺寸）
  - 显示金额（带颜色）
  - 显示成功提示
  - 进度条动画
  - 弹出/关闭动画
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-4
- **Test Requirements**:
  - `human-judgment` TR-1.1: 组件正确显示所有内容
  - `human-judgment` TR-1.2: 进度条动画正常

## [ ] Task 2: 实现滑动关闭
- **Priority**: P0
- **Depends On**: Task 1
- **File**: `src/components/RecordConfirmCard.vue`
- **Description**: 
  实现手势支持：
  - touch 事件监听
  - 上滑超过阈值触发关闭
  - 滑动过程中卡片跟随移动
- **Acceptance Criteria Addressed**: FR-7
- **Test Requirements**:
  - `human-judgment` TR-2.1: 上滑手势可以关闭卡片

## [ ] Task 3: 实现 onClose 事件
- **Priority**: P0
- **Depends On**: Task 1
- **File**: `src/components/RecordConfirmCard.vue`
- **Description**: 
  实现关闭事件：
  - 2秒倒计时结束触发 onClose
  - 滑动关闭触发 onClose
  - App 切后台暂停计时
- **Acceptance Criteria Addressed**: AC-3
- **Test Requirements**:
  - `programmatic` TR-3.1: 2秒后触发 onClose
  - `programmatic` TR-3.2: 滑动触发 onClose

## [ ] Task 4: 测试和修复
- **Priority**: P0
- **Depends On**: Task 1, Task 2, Task 3
- **File**: N/A
- **Description**: 
  - 全流程测试
  - 修复发现的问题
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3, AC-4
- **Test Requirements**:
  - `human-judgment` TR-4.1: 完整流程测试
