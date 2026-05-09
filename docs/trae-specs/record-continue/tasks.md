# 继续记下一笔 - 实施计划

## [ ] Task 1: 创建 RecordConfirmCard 组件
- **Priority**: P0
- **Depends On**: None
- **File**: `src/components/RecordConfirmCard.vue`
- **Description**: 
  创建独立的确认卡片组件，包含：
  - Props: visible, categoryIcon, categoryName, amount, type
  - Events: onContinue, onViewDetail, onClose
  - 2秒自动关闭定时器
  - 进度条动画
  - 卡片弹出/关闭动画
- **Acceptance Criteria Addressed**: AC-1, AC-2
- **Test Requirements**:
  - `human-judgment` TR-1.1: 卡片正确显示分类图标和金额
  - `human-judgment` TR-1.2: 两个按钮正确显示

## [ ] Task 2: 修改记账提交逻辑
- **Priority**: P0
- **Depends On**: Task 1
- **File**: `src/pages/record/index.vue`
- **Description**: 
  修改记账提交成功后的逻辑：
  - 成功后不直接跳转
  - 调用 RecordConfirmCard 组件显示卡片
  - 传递当前记账信息
- **Acceptance Criteria Addressed**: AC-1
- **Test Requirements**:
  - `human-judgment` TR-2.1: 提交成功后显示确认卡片

## [ ] Task 3: 实现"继续记一笔"逻辑
- **Priority**: P0
- **Depends On**: Task 2
- **File**: `src/pages/record/index.vue`
- **Description**: 
  实现点击"继续记一笔"按钮后的操作：
  - 关闭确认卡片
  - 清空金额输入框
  - 清空备注输入框
  - 保留当前分类选择
- **Acceptance Criteria Addressed**: AC-4
- **Test Requirements**:
  - `human-judgment` TR-3.1: 点击后金额和备注被清空
  - `human-judgment` TR-3.2: 分类选择保持不变

## [ ] Task 4: 实现3秒倒计时和自动跳转
- **Priority**: P0
- **Depends On**: Task 2
- **File**: `src/components/RecordConfirmCard.vue`
- **Description**: 
  实现自动跳转逻辑：
  - 卡片显示后启动3秒定时器
  - 使用 requestAnimationFrame 更新进度条
  - 超时后触发 onViewDetail 事件
  - 监听 App 前后台切换，暂停/恢复计时
- **Acceptance Criteria Addressed**: AC-3, AC-6
- **Test Requirements**:
  - `automated` TR-4.1: 3秒后自动触发跳转
  - `human-judgment` TR-4.2: App 切后台时倒计时暂停

## [ ] Task 5: 实现滑动关闭功能
- **Priority**: P1
- **Depends On**: Task 1
- **File**: `src/components/RecordConfirmCard.vue`
- **Description**: 
  添加手势支持：
  - 支持上滑关闭卡片
  - 滑动超过一定距离触发关闭
  - 滑动过程中卡片跟随移动
- **Acceptance Criteria Addressed**: NFR-1
- **Test Requirements**:
  - `human-judgment` TR-5.1: 上滑手势可以关闭卡片

## [ ] Task 6: 测试和修复
- **Priority**: P0
- **Depends On**: Task 1, Task 2, Task 3, Task 4
- **File**: N/A
- **Description**: 
  - 全流程测试
  - 修复发现的问题
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3, AC-4, AC-5, AC-6
- **Test Requirements**:
  - `human-judgment` TR-6.1: 完整流程测试
