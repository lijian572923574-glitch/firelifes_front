# 草稿暂存 - 实施计划

## [ ] Task 1: 创建草稿工具函数
- **Priority**: P0
- **Depends On**: None
- **File**: `src/utils/draft.ts`
- **Description**: 
  创建草稿工具函数：
  - saveDraft() - 保存草稿
  - loadDraft() - 加载草稿
  - clearDraft() - 清空草稿
  - isDraftExpired() - 检查是否过期
- **Acceptance Criteria Addressed**: FR-1, FR-6, FR-7
- **Test Requirements**:
  - `programmatic` TR-1.1: saveDraft() 保存成功
  - `programmatic` TR-1.2: loadDraft() 加载成功
  - `programmatic` TR-1.3: isDraftExpired() 过期判断正确

## [ ] Task 2: 实现草稿保存逻辑
- **Priority**: P0
- **Depends On**: Task 1
- **File**: `src/pages/record/index.vue`
- **Description**: 
  实现自动保存：
  - 页面失焦时保存
  - 监听页面生命周期
  - 记录保存时间
- **Acceptance Criteria Addressed**: FR-1
- **Test Requirements**:
  - `programmatic` TR-2.1: 退出时保存成功

## [ ] Task 3: 实现草稿恢复功能
- **Priority**: P0
- **Depends On**: Task 1, Task 2
- **File**: `src/pages/record/index.vue`
- **Description**: 
  实现恢复功能：
  - 页面加载时检查草稿
  - 显示恢复提示
  - 恢复/放弃按钮
  - 填充表单逻辑
- **Acceptance Criteria Addressed**: AC-2, AC-3, AC-4
- **Test Requirements**:
  - `human-judgment` TR-3.1: 有草稿时显示提示
  - `human-judgment` TR-3.2: 恢复功能正常
  - `human-judgment` TR-3.3: 放弃功能正常

## [ ] Task 4: 实现提交后清空
- **Priority**: P0
- **Depends On**: Task 1
- **File**: `src/pages/record/index.vue`
- **Description**: 
  实现清空逻辑：
  - 提交成功后调用 clearDraft()
- **Acceptance Criteria Addressed**: AC-5
- **Test Requirements**:
  - `programmatic` TR-4.1: 提交后草稿清空

## [ ] Task 5: 测试和修复
- **Priority**: P0
- **Depends On**: Task 1, Task 2, Task 3, Task 4
- **File**: N/A
- **Description**: 
  - 全流程测试
  - 修复发现的问题
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3, AC-4, AC-5, AC-6
- **Test Requirements**:
  - `human-judgment` TR-5.1: 完整流程测试
