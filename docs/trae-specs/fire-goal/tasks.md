# FIRE目标设定 - 实施计划

## [ ] Task 1: 创建 FIRE 目标页面
- **Priority**: P0
- **Depends On**: None
- **File**: `src/pages/fire/goal.vue`
- **Description**: 
  - 创建 FIRE 目标页骨架
  - 定义页面布局
  - 集成 Loading 状态
  - 集成空状态引导
- **Acceptance Criteria Addressed**: AC-7

## [ ] Task 2: 实现目标月支出输入
- **Priority**: P0
- **Depends On**: Task 1
- **File**: `src/pages/fire/goal.vue`
- **Description**: 
  - 创建金额输入框组件
  - 支持手动输入
  - 添加"自动计算"按钮
  - 实时更新目标净资产预览
- **Acceptance Criteria Addressed**: AC-2

## [ ] Task 3: 实现自动计算月均支出
- **Priority**: P0
- **Depends On**: Task 1
- **File**: `src/api/fire.ts`, `src/pages/fire/goal.vue`
- **Description**: 
  - 创建 GET /api/fire/avg-expense 接口
  - 支持 months 参数：3/6/12
  - 显示加载中状态
  - 计算后填入输入框
- **Acceptance Criteria Addressed**: AC-3

## [ ] Task 4: 实现安全提现率滑块
- **Priority**: P0
- **Depends On**: Task 1
- **File**: `src/components/RangeSlider.vue`, `src/pages/fire/goal.vue`
- **Description**: 
  - 创建 RangeSlider 组件
  - 范围 1%-6%，步长 0.5%
  - 默认值 4%
  - 显示常用预设标签
  - 实时更新目标净资产
- **Acceptance Criteria Addressed**: AC-4

## [ ] Task 5: 实现投资回报率滑块
- **Priority**: P0
- **Depends On**: Task 1
- **File**: `src/components/RangeSlider.vue`, `src/pages/fire/goal.vue`
- **Description**: 
  - 范围 1%-12%，步长 1%
  - 默认值 7%
  - 显示说明文字
- **Acceptance Criteria Addressed**: N/A（展示用）

## [ ] Task 6: 实现退休年龄滑块
- **Priority**: P0
- **Depends On**: Task 1
- **File**: `src/components/RangeSlider.vue`, `src/pages/fire/goal.vue`
- **Description**: 
  - 范围 30-70，步长 1
  - 默认值 55
- **Acceptance Criteria Addressed**: N/A（展示用）

## [ ] Task 7: 实现目标净资产预览
- **Priority**: P0
- **Depends On**: Task 2, Task 4
- **File**: `src/pages/fire/goal.vue`
- **Description**: 
  - 实时计算：目标净资产 = 目标月支出 × 12 ÷ 安全提现率
  - 数字使用大字号（64rpx）
  - 数字变化使用滚动动画
- **Acceptance Criteria Addressed**: AC-5

## [ ] Task 8: 实现保存功能
- **Priority**: P0
- **Depends On**: Task 1
- **File**: `src/api/fire.ts`, `src/pages/fire/goal.vue`
- **Description**: 
  - 创建 POST /api/fire/goal 接口
  - 验证必填项
  - 保存成功后提示"目标已保存"
  - 返回上一页或刷新进度
- **Acceptance Criteria Addressed**: AC-6

## [ ] Task 9: 实现数据加载
- **Priority**: P0
- **Depends On**: Task 1
- **File**: `src/api/fire.ts`, `src/pages/fire/goal.vue`
- **Description**: 
  - 创建 GET /api/fire/goal 接口
  - 页面加载时获取已有目标
  - 回填表单数据
- **Acceptance Criteria Addressed**: N/A（数据加载）

## [ ] Task 10: 测试和修复
- **Priority**: P0
- **Depends On**: Task 1-9
- **File**: N/A
- **Description**: 
  - 全流程测试
  - 测试表单验证
  - 测试保存功能
  - 修复发现的问题
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3, AC-4, AC-5, AC-6, AC-7
