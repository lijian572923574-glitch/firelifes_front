# 常用分类置顶 - 实施计划

## [ ] Task 1: 创建分类 API 模块
- **Priority**: P0
- **Depends On**: None
- **File**: `src/api/category.ts`
- **Description**: 
  创建分类相关 API：
  - GET /api/categories/usage - 获取分类使用频次
- **Acceptance Criteria Addressed**: FR-1
- **Test Requirements**:
  - `programmatic` TR-1.1: API 模块导出正确

## [ ] Task 2: 创建分类选择器组件增强
- **Priority**: P0
- **Depends On**: Task 1
- **File**: `src/pages/record/components/CategorySelector.vue`
- **Description**: 
  增强分类选择器：
  - 获取分类使用频次
  - 按频次调整排序
  - 添加"常用"标签显示
  - 1小时缓存
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3, AC-4
- **Test Requirements**:
  - `human-judgment` TR-2.1: 常用分类置顶显示
  - `human-judgment` TR-2.2: "常用"标签正确显示

## [ ] Task 3: 实现缓存逻辑
- **Priority**: P1
- **Depends On**: Task 1
- **File**: `src/utils/categoryCache.ts`
- **Description**: 
  实现缓存功能：
  - localStorage 存储
  - 1小时过期
  - 缓存命中时直接使用
- **Acceptance Criteria Addressed**: FR-5, NFR-1
- **Test Requirements**:
  - `programmatic` TR-3.1: 缓存正常工作

## [ ] Task 4: 测试和修复
- **Priority**: P0
- **Depends On**: Task 1, Task 2
- **File**: N/A
- **Description**: 
  - 全流程测试
  - 修复发现的问题
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3, AC-4
- **Test Requirements**:
  - `human-judgment` TR-4.1: 完整流程测试
