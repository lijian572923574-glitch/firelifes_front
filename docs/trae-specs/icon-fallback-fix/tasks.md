# 图标兜底修复 - 实施计划

## [ ] Task 1: 创建图标组件基础
- **Priority**: P0
- **Depends On**: None
- **File**: `src/components/icons/index.ts`
- **Description**: 
  创建图标基础结构：
  - 创建 icons 目录
  - 创建基础组件模板
  - 导出所有图标组件
- **Acceptance Criteria Addressed**: FR-1
- **Test Requirements**:
  - `programmatic` TR-1.1: 导出正常

## [ ] Task 2: 创建各分类 SVG 图标
- **Priority**: P0
- **Depends On**: Task 1
- **File**: `src/components/icons/`
- **Description**: 
  创建 SVG 图标组件：
  - IconMeal.vue - 餐饮
  - IconTransport.vue - 交通
  - IconShopping.vue - 购物
  - IconGame.vue - 娱乐
  - IconPhone.vue - 通讯
  - IconHospital.vue - 医疗
  - IconBook.vue - 教育
  - IconWallet.vue - 工资
  - IconBox.vue - 其他
- **Acceptance Criteria Addressed**: FR-2, AC-1, AC-2
- **Test Requirements**:
  - `human-judgment` TR-2.1: 图标正确显示
  - `human-judgment` TR-2.2: 颜色为 #00BFFF

## [ ] Task 3: 实现图标组件 props
- **Priority**: P0
- **Depends On**: Task 2
- **File**: `src/components/icons/*.vue`
- **Description**: 
  实现通用 props：
  - size: 图标大小
  - color: 描边颜色（默认 #00BFFF）
- **Acceptance Criteria Addressed**: FR-3, AC-3
- **Test Requirements**:
  - `human-judgment` TR-3.1: size prop 正常
  - `human-judgment` TR-3.2: color prop 正常

## [ ] Task 4: 替换 emoji 兜底
- **Priority**: P0
- **Depends On**: Task 2
- **File**: `src/components/CategoryItem.vue`
- **Description**: 
  替换 emoji 兜底：
  - 图标加载失败时使用 SVG 兜底
  - 根据分类类型选择对应图标
- **Acceptance Criteria Addressed**: FR-4
- **Test Requirements**:
  - `human-judgment` TR-4.1: 兜底图标正确显示

## [ ] Task 5: 测试和修复
- **Priority**: P0
- **Depends On**: Task 1, Task 2, Task 3, Task 4
- **File**: N/A
- **Description**: 
  - 全流程测试
  - 修复发现的问题
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3
- **Test Requirements**:
  - `human-judgment` TR-5.1: 完整流程测试
