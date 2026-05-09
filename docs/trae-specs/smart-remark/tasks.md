# 备注智能联想 - 实施计划

## [ ] Task 1: 创建备注 API 模块
- **Priority**: P0
- **Depends On**: None
- **File**: `src/api/remark.ts`
- **Description**: 
  创建备注相关 API：
  - GET /api/remarks/suggestions - 获取备注联想
- **Acceptance Criteria Addressed**: FR-2, FR-3
- **Test Requirements**:
  - `programmatic` TR-1.1: API 模块导出正确

## [ ] Task 2: 创建 RemarkInput 组件
- **Priority**: P0
- **Depends On**: Task 1
- **File**: `src/pages/record/components/RemarkInput.vue`
- **Description**: 
  创建备注输入组件：
  - 输入框基础样式
  - 联想列表弹层
  - 联想项渲染（带高亮）
  - 点击填充逻辑
  - 失焦隐藏逻辑
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3, AC-5
- **Test Requirements**:
  - `human-judgment` TR-2.1: 输入触发联想
  - `human-judgment` TR-2.2: 联想列表正确显示
  - `human-judgment` TR-2.3: 点击填充功能正常

## [ ] Task 3: 实现防抖和缓存
- **Priority**: P0
- **Depends On**: Task 1, Task 2
- **File**: `src/pages/record/components/RemarkInput.vue`
- **Description**: 
  实现性能优化：
  - 300ms 防抖处理
  - 本地缓存10分钟
  - 网络错误静默处理
- **Acceptance Criteria Addressed**: FR-7, NFR-1, NFR-2
- **Test Requirements**:
  - `programmatic` TR-3.1: 防抖正常工作
  - `programmatic` TR-3.2: 缓存正常工作

## [ ] Task 4: 实现分类优先逻辑
- **Priority**: P0
- **Depends On**: Task 2
- **File**: `src/pages/record/components/RemarkInput.vue`
- **Description**: 
  实现分类优先联想：
  - 获取当前选中分类 ID
  - 查询时传递分类 ID
  - 同分类备注优先排序
- **Acceptance Criteria Addressed**: AC-4
- **Test Requirements**:
  - `human-judgment` TR-4.1: 同分类备注优先显示

## [ ] Task 5: 测试和修复
- **Priority**: P0
- **Depends On**: Task 1, Task 2, Task 3, Task 4
- **File**: N/A
- **Description**: 
  - 全流程测试
  - 修复发现的问题
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3, AC-4, AC-5
- **Test Requirements**:
  - `human-judgment` TR-5.1: 完整流程测试
