# Tabbar 更新 - The Implementation Plan (Decomposed and Prioritized Task List)

## [x] Task 1: 修改 CustomTabbar.vue 组件布局
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 移除中间 tab 的突出显示效果
  - 将所有5个 tab 改为平铺布局
  - 更新 tabList 数据结构，移除特殊的中间 tab 逻辑
- **Acceptance Criteria Addressed**: AC-2
- **Test Requirements**:
  - `human-judgement` TR-1.1: 检查 tabbar 布局是否为平铺的5个 tab ✓
  - `human-judgement` TR-1.2: 确认没有突出的圆形按钮 ✓
- **Notes**: 确保所有 tab 高度一致 ✓

## [x] Task 2: 更新 tabbar 文本标签
- **Priority**: P0
- **Depends On**: Task 1
- **Description**: 
  - 更新 CustomTabbar.vue 中的 tabList
  - 更新 pages.json 中的 tabBar 配置
  - 标签顺序：明细、统计、记账、资产、我的
- **Acceptance Criteria Addressed**: AC-1
- **Test Requirements**:
  - `human-judgement` TR-2.1: 检查 tabbar 显示的文本标签是否正确 ✓
  - `human-judgement` TR-2.2: 检查 pages.json 中的配置是否同步更新 ✓
- **Notes**: "资产" 页面使用现有的 analysis/index.vue ✓

## [x] Task 3: 更新 tabbar 图标显示
- **Priority**: P1
- **Depends On**: Task 2
- **Description**: 
  - 为每个 tab 准备对应的图标资源
  - 更新 CustomTabbar.vue 中的图标路径
  - 更新 pages.json 中的图标路径
- **Acceptance Criteria Addressed**: AC-4
- **Test Requirements**:
  - `human-judgement` TR-3.1: 检查每个 tab 是否显示对应的图标 ✓
  - `human-judgement` TR-3.2: 检查选中状态的图标显示是否正确 ✓
- **Notes**: 使用 emoji 作为临时图标方案 ✓

## [x] Task 4: 测试 tabbar 切换功能
- **Priority**: P0
- **Depends On**: Task 2
- **Description**: 
  - 测试点击每个 tab 是否能正确切换页面
  - 测试选中状态是否正确显示
  - 测试所有5个页面的 tabbar 显示
- **Acceptance Criteria Addressed**: AC-3, AC-4
- **Test Requirements**:
  - `programmatic` TR-4.1: 验证每个页面路由跳转正常 ✓
  - `human-judgement` TR-4.2: 验证当前页面 tab 正确高亮 ✓
