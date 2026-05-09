# 记账模板 - 实施计划

## [ ] Task 1: 创建模板 API 模块
- **Priority**: P0
- **Depends On**: None
- **File**: `src/api/template.ts`
- **Description**: 
  创建模板相关 API：
  - GET /api/templates - 获取模板列表
  - POST /api/templates - 创建模板
  - PUT /api/templates/:id - 更新模板
  - DELETE /api/templates/:id - 删除模板
  - PUT /api/templates/sort - 批量更新排序
- **Acceptance Criteria Addressed**: FR-3, FR-4, FR-5, FR-6, FR-7
- **Test Requirements**:
  - `programmatic` TR-1.1: API 模块导出正确

## [ ] Task 2: 创建模板列表页面
- **Priority**: P0
- **Depends On**: Task 1
- **File**: `src/pages/template/index.vue`
- **Description**: 
  创建模板列表页面：
  - 按类型分组显示
  - 模板项显示名称、分类、金额
  - 点击填充逻辑
  - 新建入口
  - 编辑/删除按钮
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3, AC-5
- **Test Requirements**:
  - `human-judgment` TR-2.1: 模板列表正常显示
  - `human-judgment` TR-2.2: 按类型分组正确

## [ ] Task 3: 创建模板编辑页面
- **Priority**: P0
- **Depends On**: Task 1
- **File**: `src/pages/template/edit.vue`
- **Description**: 
  创建模板编辑页面：
  - 模板名称输入
  - 类型选择
  - 分类选择
  - 金额输入
  - 备注输入
  - 账户选择
  - 保存功能
- **Acceptance Criteria Addressed**: AC-4
- **Test Requirements**:
  - `human-judgment` TR-3.1: 编辑表单完整
  - `human-judgment` TR-3.2: 表单验证正常

## [ ] Task 4: 集成到记账页
- **Priority**: P0
- **Depends On**: Task 2
- **File**: `src/pages/record/index.vue`
- **Description**: 
  集成模板功能：
  - 右上角添加"模板"按钮
  - 点击弹出模板列表页面
  - 选择模板后填充表单
- **Acceptance Criteria Addressed**: AC-1
- **Test Requirements**:
  - `human-judgment` TR-4.1: 按钮正确显示
  - `human-judgment` TR-4.2: 模板选择填充正常

## [ ] Task 5: 实现模板排序
- **Priority**: P1
- **Depends On**: Task 2
- **File**: `src/pages/template/index.vue`
- **Description**: 
  实现模板排序功能：
  - 拖拽排序
  - 保存排序结果
- **Acceptance Criteria Addressed**: FR-7
- **Test Requirements**:
  - `human-judgment` TR-5.1: 拖拽排序正常

## [ ] Task 6: 测试和修复
- **Priority**: P0
- **Depends On**: Task 1, Task 2, Task 3, Task 4
- **File**: N/A
- **Description**: 
  - 全流程测试
  - 修复发现的问题
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3, AC-4, AC-5
- **Test Requirements**:
  - `human-judgment` TR-6.1: 完整流程测试
